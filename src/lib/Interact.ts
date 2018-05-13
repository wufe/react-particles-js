import {ParticleObject, ParticlesLibrary, hexToRgb} from '.';
import { IParams } from '../interfaces';

export default class Interact{

	params: IParams;
	library: ParticlesLibrary;

	constructor( params: IParams, library: ParticlesLibrary ){
		this.params = params;
		this.library = library;
	}

	linkParticles( p1: ParticleObject, p2: ParticleObject ): void{
		let dx: number = p1.x - p2.x;
		let dy: number = p1.y - p2.y;
		let dist: number = Math.sqrt( dx * dx + dy * dy );
		let {canvas} = this.library;

		const {
			lineLinkedColor: lineLinkedColor1,
			lineLinkedDistance: lineLinkedDistance1,
			lineLinkedOpacity: lineLinkedOpacity1,
			lineLinkedWidth: lineLinkedWidth1,
			lineLinkedShadowEnabled: lineLinkedShadowEnabled1,
			lineLinkedShadowColor: lineLinkedShadowColor1,
			lineLinkedShadowBlur: lineLinkedShadowBlur1
		} = p1.element.props;
		const {
			lineLinkedColor: lineLinkedColor2,
			lineLinkedDistance: lineLinkedDistance2,
			lineLinkedOpacity: lineLinkedOpacity2,
			lineLinkedWidth: lineLinkedWidth2,
			lineLinkedShadowEnabled: lineLinkedShadowEnabled2,
			lineLinkedShadowColor: lineLinkedShadowColor2,
			lineLinkedShadowBlur: lineLinkedShadowBlur2
		} = p2.element.props;

		const desiredDistance = Math.max(lineLinkedDistance1, lineLinkedDistance2);
		if( dist <= desiredDistance ){
			const opacity = Math.round((lineLinkedOpacity1 + lineLinkedOpacity2) / 2 * 100) / 100;
			let opacity_line: number = opacity - ( dist / ( 1 / opacity ) ) / desiredDistance;
			if( opacity_line > 0 ){
				let strokeStyle: any;
				let lineColor: any;
				if (lineLinkedColor1 === 'none' && lineLinkedColor2 === 'none') {
					lineColor = hexToRgb("#E1E1E1");
					strokeStyle = `rgba( ${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${opacity_line} )`;
				} else if(lineLinkedColor1 === 'none' && lineLinkedColor2 !== 'none') {
					lineColor = hexToRgb(lineLinkedColor2);
					strokeStyle = `rgba( ${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${opacity_line} )`;
				} else if(lineLinkedColor1 !== 'none' && lineLinkedColor2 === 'none') {
					lineColor = hexToRgb(lineLinkedColor1);
					strokeStyle = `rgba( ${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${opacity_line} )`;
				} else {
					lineColor = canvas.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
					const color1 = hexToRgb(lineLinkedColor1);
					const color2 = hexToRgb(lineLinkedColor2);
					lineColor.addColorStop("0", `rgba( ${color1.r}, ${color1.g}, ${color1.b}, ${opacity_line} )`);
					lineColor.addColorStop("1", `rgba( ${color2.r}, ${color2.g}, ${color2.b}, ${opacity_line} )`);
					strokeStyle = lineColor;
				}
				canvas.ctx.save();
				canvas.ctx.strokeStyle = strokeStyle;
				canvas.ctx.lineWidth = Math.round((lineLinkedWidth1 + lineLinkedWidth2) / 2);

				canvas.ctx.beginPath();
				if( lineLinkedShadowEnabled1 && lineLinkedShadowEnabled2 ){
					canvas.ctx.shadowBlur = Math.round((lineLinkedShadowBlur1 + lineLinkedShadowBlur2) / 2);
					let shadowColor = hexToRgb("#E1E1E1"); // default value
					if (lineLinkedShadowColor1 === 'none' && lineLinkedShadowColor2 !== 'none') {
						shadowColor = hexToRgb(lineLinkedShadowColor2);
					} else if(lineLinkedShadowColor1 !== 'none' && lineLinkedShadowColor2 === 'none') {
						shadowColor= hexToRgb(lineLinkedShadowColor1);
					} else if(lineLinkedShadowColor1 !== 'none' && lineLinkedShadowColor2 !== 'none') {
						const rgb1 = hexToRgb(lineLinkedShadowColor1);
						const rgb2 = hexToRgb(lineLinkedShadowColor2);
						shadowColor.r = Math.round((rgb1.r + rgb2.r) / 2);
						shadowColor.g = Math.round((rgb1.g + rgb2.g) / 2);
						shadowColor.b = Math.round((rgb1.b + rgb2.b) / 2);
					}
					canvas.ctx.shadowColor = `rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, 1)`;
				}
				
				canvas.ctx.moveTo( p1.x, p1.y );
				canvas.ctx.lineTo( p2.x, p2.y );
				canvas.ctx.stroke();
				canvas.ctx.closePath();
				canvas.ctx.restore();
			}
		}
	}

	attractParticles( p1: ParticleObject, p2: ParticleObject ): void{
		let dx: number = p1.x - p2.x;
		let dy: number = p1.y - p2.y;
		let dist: number = Math.sqrt( dx * dx + dy * dy );

		if (p1.element.props.moveAttractEnabled && !p2.element.props.moveAttractEnabled) {
			const particle = p1;
			const {
				moveAttractDistance,
				moveAttractRotateX,
				moveAttractRotateY
			} = particle.element.props;
			if (dist <= moveAttractDistance) {
				particle.xVelox -= dx / (moveAttractRotateX * 1000);
				particle.yVelox -= dy / (moveAttractRotateY * 1000);
			}
		} else if(!p1.element.props.moveAttractEnabled && p2.element.props.moveAttractEnabled) {
			const particle = p2;
			const {
				moveAttractDistance,
				moveAttractRotateX,
				moveAttractRotateY
			} = particle.element.props;
			if (dist <= moveAttractDistance) {
				particle.xVelox -= dx / (moveAttractRotateX * 1000);
				particle.yVelox -= dy / (moveAttractRotateY * 1000);
			}
		} else {
			const {
				lineLinkedDistance: lineLinkedDistance1,
				moveAttractRotateX: moveAttractRotateX1,
				moveAttractRotateY: moveAttractRotateY1
			} = p1.element.props;
			const {
				lineLinkedDistance: lineLinkedDistance2,
				moveAttractRotateX: moveAttractRotateX2,
				moveAttractRotateY: moveAttractRotateY2
			} = p2.element.props;

			const desiredDistance = Math.max(lineLinkedDistance1, lineLinkedDistance2);

			if( dist <= desiredDistance ){
				p1.xVelox -= dx / (moveAttractRotateX1 * 1000);
				p1.yVelox -= dy / (moveAttractRotateY1 * 1000);
	
				p2.xVelox += dx / (moveAttractRotateX2 * 1000);
				p2.yVelox += dy / (moveAttractRotateY2 * 1000);
			}
		}

		
	}

	bounceParticles( p1: ParticleObject, p2: ParticleObject ): void{
		let dx: number = p1.x - p2.x;
		let dy: number = p1.y - p2.y;
		let dist: number = Math.sqrt( dx * dx + dy * dy );
		let dist_p: number = p1.radius + p2.radius;

		if( dist <= dist_p ){
			p1.xVelox = -p1.xVelox;
			p1.yVelox = -p1.yVelox;
			p2.xVelox = -p2.xVelox;
			p2.yVelox = -p2.yVelox;
		}
	}
}