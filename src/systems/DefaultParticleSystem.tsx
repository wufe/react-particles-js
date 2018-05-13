import * as React from 'react';
import { IParticleSystem, IPosition, IParams, ICanvasParam } from "../interfaces";
import { Particle } from "../components/Particle";

export class DefaultParticleSystem implements IParticleSystem {

    private particles: Particle[] = [];

    // TODO: Move these properties to the interface
    // and initialize them through "buildSystemFromParams"
    particlesDensityEnabled?: boolean;
    particlesDensityValueArea?: number;

    getParticles = () => this.particles;
    onPushRequest = (numberOfParticles: number, position: IPosition) => {};
    onRemoveRequest = (...particles: Particle[]) => {};

    buildSystemFromParams(params: IParams) {

    }

    buildParticlesFromParams(params: IParams, canvas: HTMLCanvasElement) {
        const {particles} = params;
        let particlesCount: number;
        if (this.particlesDensityEnabled) {
            let area: number = canvas.width * canvas.height / 1000;
            // TODO: detect retina
            // if (isRetina()) {
            //     area = area / canvas.pxratio * 2;
            // }
            particlesCount = area * particles.number.value / this.particlesDensityValueArea;
            // TODO: Create these number of particles without count checking.
            // The library will check if something changed.
            // This commented piece of code needs to be deleted.
            // Serves only as a reminder.

            // let missing_particles: number = this.library.manager.particleObjects.length - nb_particles;
			// if( missing_particles < 0 ){
			// 	modes.pushParticles( Math.abs( missing_particles ) );
			// }else{
			// 	modes.removeParticles( missing_particles );
			// }
        } else {
            particlesCount = particles.number.value;
        }
        const particleArray: Particle[] = [];
        for (let i = 0; i < particlesCount; i++) {
            particleArray.push(
                <Particle
                    id={i}
                    color={particles.color.value}
                    shapeType={particles.shape.type}
                    strokeWidth={particles.shape.stroke.width}
                    strokeColor={particles.shape.stroke.color}
                    polygonSides={particles.shape.polygon.nb_sides}
                    imageSrc={particles.shape.image.src}
                    imageHeight={particles.shape.image.height}
                    imageWidth={particles.shape.image.width}
                    opacityValue={particles.opacity.value}
                    opacityRandomness={particles.opacity.random}
                    opacityAnimationEnabled={particles.opacity.anim.enable}
                    opacityAnimationSpeed={particles.opacity.anim.speed}
                    opacityAnimationMinimum={particles.opacity.anim.opacity_min}
                    opacityAnimationSync={particles.opacity.anim.sync}
                    sizeValue={particles.size.value}
                    sizeRandomness={particles.size.random}
                    sizeAnimationEnabled={particles.size.anim.enable}
                    sizeAnimationSpeed={particles.size.anim.speed}
                    sizeAnimationMinimum={particles.size.anim.size_min}
                    sizeAnimationSync={particles.size.anim.sync}
                    lineLinkedEnabled={particles.line_linked.enable}
                    lineLinkedDistance={particles.line_linked.distance}
                    lineLinkedColor={particles.line_linked.color}
                    lineLinkedOpacity={particles.line_linked.opacity}
                    lineLinkedWidth={particles.line_linked.width}
                    lineLinkedShadowEnabled={particles.line_linked.shadow.enable}
                    lineLinkedShadowBlur={particles.line_linked.shadow.blur}
                    lineLinkedShadowColor={particles.line_linked.shadow.color}
                    moveEnabled={particles.move.enable}
                    moveSpeed={particles.move.speed}
                    moveDirection={particles.move.direction}
                    moveRandomness={particles.move.random}
                    moveStraight={particles.move.straight}
                    moveOutMode={particles.move.out_mode}
                    moveBounce={particles.move.bounce}
                    moveAttractEnabled={particles.move.attract.enable}
                    moveAttractDistance={particles.line_linked.distance}
                    moveAttractRotateX={particles.move.attract.rotateX}
                    moveAttractRotateY={particles.move.attract.rotateY} /> as any
            );
        }
    }

    setParticles(particles: Particle[]) {
        this.particles = particles;
    }
}