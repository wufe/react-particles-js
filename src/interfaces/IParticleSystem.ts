import { Particle } from "../components/Particle";
import { IPosition } from "./IPosition";
import { ISystemLibraryProxy } from ".";

// A particle system manages the lifetime of a bunch of particles
export interface IParticleSystem {
    getParticles: () => Particle[];
    onPushRequest?: (numberOfParticles: number, position: IPosition) => any;
    onRemoveRequest?: (...particles: Particle[]) => any;
}

export interface IParticleSystemClass {
    // Should share an interface instead of the entire library
    new(library: ISystemLibraryProxy): IParticleSystem;
}