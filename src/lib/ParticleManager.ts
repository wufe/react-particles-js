import {ParticleObject, Interact, isInArray, Modes,  ParticlesLibrary, Vendors} from '.';
import { Particle } from '../components/Particle';
import { IParams, TOutModeRemoveBorder } from '../interfaces';

export default class ParticleManager{

	params: IParams;
	interact: Interact;
	library: ParticlesLibrary;
	modes: Modes;
	vendors: Vendors;

	particleObjects: ParticleObject[] = [];

	particleElements: Particle[] = [];

	constructor( params: IParams, interact: Interact, modes: Modes, vendors: Vendors, library: ParticlesLibrary ){
		this.params = params;
		this.interact = interact;
		this.modes = modes;
		this.vendors = vendors;
		this.library = library;
	}

	setParticleElements(particleElements: Particle[]): void {
		this.particleElements = particleElements;
		this.particlesCreate();
	}

	particlesCreate(): void{
		let {color, opacity} = this.params.particles;
		const newParticles: ParticleObject[] = [];
		const particleElementsId = this.particleElements.map(p => p.props.id);
		this.particleObjects = this.particleObjects.filter(p => particleElementsId.indexOf(p.element.props.id)>-1);
		this.particleElements.forEach(e => {
			const foundParticle = this.particleObjects
				.find(p => p.element.props.id === e.props.id);
			if (!foundParticle) {
				return newParticles.push(new ParticleObject(this.params, this.library, e));
			} else {
				foundParticle.element = e;
			}
			foundParticle.element = e;
		});
		if (newParticles.length) {
			this.particleObjects = [
				...this.particleObjects,
				...newParticles
			];
		}
	}

	particlesUpdate(): void{
		let {canvas, interact, modes} = this.library;

		this.particleObjects.forEach( ( particle: ParticleObject, i: number ) => {
			const {moveEnabled, moveSpeed} = particle.element.props;
			if( moveEnabled ){
				let ms = moveSpeed / 2;
				particle.x += particle.xVelox * ms;
				particle.y += particle.yVelox * ms;
			}

			const {opacityAnimationEnabled, opacityValue, opacityAnimationMinimum} = particle.element.props;
			if( opacityAnimationEnabled ){
				if( particle.opacity_status == true ){
					if( particle.opacity >= opacityValue )
						particle.opacity_status = false;
					particle.opacity += particle.opacityVelox;
				}else{
					if( particle.opacity <= opacityAnimationMinimum )
						particle.opacity_status = true;
					particle.opacity -= particle.opacityVelox;
				}
				if( particle.opacity < 0 )
					particle.opacity = 0;
			}

			const {sizeAnimationEnabled, sizeValue, sizeAnimationMinimum} = particle.element.props;
			if( sizeAnimationEnabled ){
				if( particle.size_status == true ){
					if( particle.radius >= sizeValue )
						particle.size_status = false;
					particle.radius += particle.sizeVelox;
				}else{
					if( particle.radius <= sizeAnimationMinimum )
						particle.size_status = true;
					particle.radius -= particle.sizeVelox;
				}
				if( particle.radius < 0 )
					particle.radius = 0;
			}

			type Pos = {
				x_left: number;
				x_right: number;
				y_top: number;
				y_bottom: number;
			};
			let new_pos: Pos;

			const {moveOutMode, moveOutModeRemoveBorders, moveOutModeRemoveFallback} = particle.element.props;
			if(moveOutMode === 'bounce' || moveOutModeRemoveFallback === 'bounce'){
				new_pos = {
					x_left: particle.radius,
					x_right: canvas.width,
					y_top: particle.radius,
					y_bottom: canvas.height
				};
			} else {
				new_pos = {
					x_left: -particle.radius,
					x_right: canvas.width + particle.radius,
					y_top: -particle.radius,
					y_bottom: canvas.height + particle.radius
				};
			}

			let offscreenBorder: TOutModeRemoveBorder;
			let isOffscreen = false;

			if( particle.x - particle.radius > canvas.width ){
				isOffscreen = true;
				offscreenBorder = 'right';
			}else if( particle.x + particle.radius < 0 ){
				isOffscreen = true;
				offscreenBorder = 'left';
			}

			if( particle.y - particle.radius > canvas.height ){
				isOffscreen = true;
				offscreenBorder = 'bottom';
			}else if( particle.y + particle.radius < 0 ){
				isOffscreen = true;
				offscreenBorder = 'top';
			}

			if (isOffscreen) {
				if (moveOutMode === 'remove' && moveOutModeRemoveBorders.indexOf(offscreenBorder) > -1) {
					const particleSystem = this.library.getSystem();
					if (particleSystem) {
						particleSystem.onRemoveRequest(particle.element);
						return;
					}
				} else {
					switch (offscreenBorder) {
						case 'right':
							particle.x = new_pos.x_left;
							particle.y = Math.random() * canvas.height;
							break;
						case 'left':
							particle.x = new_pos.x_right;
							particle.y = Math.random() * canvas.height;
							break;
						case 'bottom':
							particle.y = new_pos.y_top;
							particle.x = Math.random() * canvas.width;
							break;
						case 'top':
							particle.y = new_pos.y_bottom;
							particle.x = Math.random() * canvas.width;
							break;
					}
				}
				
			}

			// Bounce collision check
			let collisionBorder: TOutModeRemoveBorder;
			let hasCollided = false;
			if( particle.x + particle.radius > canvas.width ) {
				hasCollided = true;
				collisionBorder = 'right';
			} else if( particle.x - particle.radius < 0 ) {
				hasCollided = true;
				collisionBorder = 'left';
			}

			if( particle.y + particle.radius > canvas.height ) {
				hasCollided = true;
				collisionBorder = 'bottom';
			} else if( particle.y - particle.radius < 0 ) {
				hasCollided = true;
				collisionBorder = 'top';
			}

			if(moveOutMode === 'bounce' ||
				(moveOutMode === 'remove' &&
					hasCollided &&
					moveOutModeRemoveBorders.indexOf(collisionBorder) === -1 &&
					moveOutModeRemoveFallback === 'bounce')){
				switch (collisionBorder) {
					case 'right':
						particle.xVelox = -particle.xVelox;
						break;
					case 'left':
						particle.xVelox = -particle.xVelox;
						break;
					case 'bottom':
						particle.yVelox = -particle.yVelox;
						break;
					case 'top':
						particle.yVelox = -particle.yVelox;
						break;
				}
			}

			if( isInArray( 'grab', this.params.interactivity.events.onhover.mode ) ){
				modes.grabParticle( particle );
			}

			if( isInArray( 'bubble', this.params.interactivity.events.onhover.mode ) || 
				isInArray( 'bubble', this.params.interactivity.events.onclick.mode ) ){
				modes.bubbleParticle( particle );
			}

			if( isInArray( 'repulse', this.params.interactivity.events.onhover.mode ) || 
				isInArray( 'repulse', this.params.interactivity.events.onclick.mode ) ){
				modes.repulseParticle( particle );
			}

			const {lineLinkedEnabled, moveAttractEnabled, moveBounce} = particle.element.props;
			// if( lineLinkedEnabled || moveAttractEnabled ){
				for( let j = i + 1; j < this.particleObjects.length; j++ ){
					let link = this.particleObjects[ j ];

					if( lineLinkedEnabled && link.element.props.lineLinkedEnabled )
						interact.linkParticles( particle, link );

					if( moveAttractEnabled || link.element.props.moveAttractEnabled )
						interact.attractParticles( particle, link );

					if( moveBounce )
						interact.bounceParticles( particle, link );
				}
			// }
		});
	}

	particlesDraw(): void{

		let {canvas, manager} = this.library;

		canvas.ctx.clearRect( 0, 0, canvas.width, canvas.height );
		manager.particlesUpdate();

		this.particleObjects.forEach( ( particle: ParticleObject ) => {
			particle.draw();
		});
	}

	particlesEmpty(): void{
		this.particleObjects = [];
	}

	particlesRefresh(): void{

		let {tmp, vendors} = this.library;

		cancelAnimationFrame( tmp.checkAnimFrame );
		cancelAnimationFrame( tmp.drawAnimFrame );
		tmp.source_svg = undefined;
		tmp.img_obj = undefined;
		tmp.count_svg = 0;
		this.particlesEmpty();
		this.library.canvasClear();
		this.library.start();
	}

}