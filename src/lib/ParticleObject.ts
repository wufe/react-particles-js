import {hexToRgb, ParticlesLibrary, getColor, TColor} from '.';
import { Particle } from '..';
import { TShapeType, IParams } from '../interfaces';

export default class ParticleObject {

	radius: number;
	radius_bubble: number;
	size_status: boolean;
	sizeVelox: number;

	x: number;
	y: number;

	color: TColor;

	opacity: number;
	opacity_bubble: number;
	opacity_status: boolean;
	opacityVelox: number;

	xVelox: number;
	yVelox: number;

	vx_i: number;
	vy_i: number;

	shape: TShapeType;

	img: { src: string; ratio: number; loaded?: boolean; obj?: any; };

	constructor(
		private params: IParams,
		private library: ParticlesLibrary,
		public element: Particle
		// color?: any,
		// opacity?: any,
		// position?: { x: number; y: number; }
	){
		const {initialX: x, initialY: y, color} = element.props;
		const position = x && y ? {x, y} : undefined;
		this.setupSize();
		this.setupPosition(position);
		this.setupColor(color);
		this.setupOpacity();
		this.setupAnimation();
	}

	setupSize(): void{
		const {sizeRandomness, sizeValue, sizeAnimationEnabled, sizeAnimationSpeed, sizeAnimationSync} = this.element.props;
		this.radius = ( sizeRandomness ? Math.random() : 1 ) * sizeValue;
		if( sizeAnimationEnabled ){
			this.size_status = false;
			this.sizeVelox = sizeAnimationSpeed / 100;
			if( !sizeAnimationSync )
				this.sizeVelox = this.sizeVelox * Math.random();
		}
	}

	setupPosition( position?: { x: number; y: number; }): void{

		let {canvas, vendors} = this.library;

		this.x = position ? position.x : Math.random() * canvas.width;
		this.y = position ? position.y : Math.random() * canvas.height;
		if (!position) {
			const {initialX, initialY} = this.element.props;
			this.x = initialX !== undefined ? initialX : Math.random() * canvas.width;
			this.y = initialY !== undefined ? initialY : Math.random() * canvas.height;
		} else {
			this.x = position.x;
			this.y = position.y;
		}

		if( this.x > canvas.width - this.radius * 2 ){
			this.x = this.x - this.radius;
		}else if( this.x < this.radius * 2 ){
			this.x = this.x + this.radius;
		}
		if( this.y > canvas.height - this.radius * 2 ){
			this. y = this.y - this.radius;
		}else if( this.y < this.radius * 2 ){
			this.y = this.y + this.radius;
		}

		if( this.element.props.moveBounce ){
			vendors.checkOverlap( this, position );
		}
	}

	setupColor(color: string){
		this.color = getColor(color);
	}

	setupOpacity(): void{
		const {opacityRandomness, opacityValue, opacityAnimationEnabled, opacityAnimationSpeed, opacityAnimationSync} = this.element.props;
		this.opacity = (opacityRandomness ? Math.random() : 1) * opacityValue;
		if( opacityAnimationEnabled ){
			this.opacity_status = false;
			this.opacityVelox = opacityAnimationSpeed / 100;
			if( !opacityAnimationSync ){
				this.opacityVelox = this.opacityVelox * Math.random();
			}
		}
	}

	setupAnimation(): void{

		let {tmp, vendors} = this.library;
		const {moveDirection, moveStraight, moveRandomness, shapeType, imageSrc, imageWidth, imageHeight} = this.element.props;

		let baseVelox: { x: number; y: number; } = null;
		switch( moveDirection ){
			case 'top':
				baseVelox = { x: 0, y: -1 };
				break;
			case 'top-right':
				baseVelox = { x: 0.5, y: -0.5 };
				break;
			case 'right':
				baseVelox = { x: 1, y: 0 };
				break;
			case 'bottom-right':
				baseVelox = { x: 0.5, y: 0.5 };
				break;
			case 'bottom':
				baseVelox = { x: 0, y: 1 };
				break;
			case 'bottom-left':
				baseVelox = { x: -0.5, y: 1 };
				break;
			case 'left':
				baseVelox = { x: -1, y:0 };
				break;
			case 'top-left':
				baseVelox = { x: -0.5, y: -0.5 };
				break;
			default:
				baseVelox = { x: 0, y: 0 };
				break;
		}
		if( moveStraight ){
			this.xVelox = baseVelox.x;
			this.yVelox = baseVelox.y;
			if( moveRandomness ){
				this.xVelox = this.xVelox * ( Math.random() );
				this.yVelox = this.yVelox * ( Math.random() );
			}
		}else{
			this.xVelox = baseVelox.x + Math.random() - 0.5;
			this.yVelox = baseVelox.y + Math.random() - 0.5;
		}

		this.vx_i = this.xVelox;
		this.vy_i = this.yVelox;

		let shape_type: TShapeType = shapeType;
		this.shape = shape_type;

		if( this.shape == 'image' ){
			this.img = {
				src: imageSrc,
				ratio: imageWidth / imageHeight
			};
			if( !this.img.ratio )
				this.img.ratio = 1;
			if( tmp.img_type == 'svg' && tmp.source_svg != undefined ){
				vendors.createSvgImg( this );
				if( tmp.pushing ){
					this.img.loaded = false;
				}
			}
		}
	}

	public draw(): void{
		let {canvas, tmp, vendors} = this.library;

		let radius: number;
		if( this.radius_bubble != undefined ){
			radius = this.radius_bubble;
		}else{
			radius = this.radius;
		}

		let opacity: number;
		if( this.opacity_bubble != undefined ){
			opacity = this.opacity_bubble;
		}else{
			opacity = this.opacity;
		}

		let color_value: string;
		if( this.color.rgb ){
			let {r, g, b} = this.color.rgb;
			color_value = `rgba( ${r}, ${g}, ${b}, ${opacity} )`;
		}else{
			let {h, s, l} = this.color.hsl;
			color_value = `hsla( ${h}, ${s}, ${l}, ${opacity} )`;
		}

		canvas.ctx.fillStyle = color_value;
		canvas.ctx.beginPath();

		switch( this.shape ){
			case 'circle':
				canvas.ctx.arc( this.x, this.y, radius, 0, Math.PI * 2, false );
				break;

			case 'edge':
				canvas.ctx.rect( this.x - radius, this.y - radius, radius * 2, radius * 2 );
				break;

			case 'triangle':
				vendors.drawShape( canvas.ctx, this.x - radius, this.y + radius / 1.66, radius * 2, 3, 2 );
				break;

			case 'polygon':
				vendors.drawShape(
					canvas.ctx,
					this.x - radius / ( this.params.particles.shape.polygon.nb_sides / 3.5 ),
					this.y - radius / ( 2.66 / 3.5 ),
					radius * 2.66 / ( this.params.particles.shape.polygon.nb_sides / 3 ),
					this.params.particles.shape.polygon.nb_sides,
					1
				);
				break;

			case 'star':
				vendors.drawShape(
					canvas.ctx,
					this.x - radius * 2 / ( this.params.particles.shape.polygon.nb_sides / 4 ),
					this.y - radius / ( 2 * 2.66 / 3.5 ),
					radius * 2 * 2.66 / ( this.params.particles.shape.polygon.nb_sides / 3 ),
					this.params.particles.shape.polygon.nb_sides,
					2
				);
				break;

			case 'image':
				let draw: ( img_obj: any ) => void = 
					( img_obj ) => {
						canvas.ctx.drawImage(
							img_obj,
							this.x - radius,
							this.y - radius,
							radius * 2,
							radius * 2 / this.img.ratio
						);
					};
				let img_obj: any;
				if( tmp.img_type == 'svg' ){
					img_obj = this.img.obj;
				}else{
					img_obj = tmp.img_obj;
				}
				if( img_obj )
					draw( img_obj );
				break;
		}

		canvas.ctx.closePath();

		const {strokeWidth, strokeColor} = this.element.props;

		if( strokeWidth > 0 ){
			canvas.ctx.strokeStyle = strokeColor;
			canvas.ctx.lineWidth = strokeWidth;
			canvas.ctx.stroke();
		}

		canvas.ctx.fill();
	}

}