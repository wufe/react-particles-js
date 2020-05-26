// Type definitions for react-particles-js v3.0.0
// Project: https://github.com/wufe/react-particles-js
// Definitions by: Simone Bembi <https://github.com/wufe>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="react" />

import { ComponentClass } from "react";
import { IOptions } from "tsparticles/dist/Options/Interfaces/IOptions";
import { Container } from "tsparticles/dist/Core/Container";
import { RecursivePartial } from "tsparticles/dist/Types/RecursivePartial";

export * from 'tsparticles/dist/Enums';

export type IParticlesParams = RecursivePartial<IOptions>;

export interface ParticlesProps {
	width?: string;
	height?: string;
	params?: IParticlesParams;
	style?: any;
	className?: string;
	canvasClassName?: string;
	particlesRef?: React.RefObject<Container>;
}

type Particles = ComponentClass<ParticlesProps>;

declare const Particles: Particles;
export default Particles;
