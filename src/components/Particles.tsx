import * as React from 'react';
import {Component, ReactChildren} from 'react';
import deepClone = require('lodash.clonedeep');

import {ParticlesLibrary, deepExtend, getDefaultParams} from '../lib';
import { Particle } from './Particle';
import { IParticleSystem, IParticleSystemClass, IParams } from '../interfaces';
import { DefaultParticleSystem } from '../systems/DefaultParticleSystem';
import { SystemLibraryProxy } from '../lib/SystemLibraryProxy';

export interface ParticlesProps{
	width?: string;
	height?: string;
	params?: Partial<IParams>;
	style?: any;
	className?: string;
	canvasClassName?: string;
	system?: IParticleSystemClass;
	children?: any
}

export interface ParticlesState{
	canvas?: HTMLCanvasElement;
	library?: ParticlesLibrary;
}

export default class Particles extends Component<ParticlesProps, ParticlesState>{

	public static defaultProps: ParticlesProps = {
		children: undefined,
		width: "100%",
		height: "100%",
		params: {},
		style: {}
	};

	private system: IParticleSystem;
	private propsSystemInstance: IParticleSystem;
	private systemLibraryProxy: SystemLibraryProxy = new SystemLibraryProxy();

	constructor( props: ParticlesProps ){
		super( props );
		this.state = {
			canvas: undefined,
			library: undefined
		}
		this.loadCanvas = this.loadCanvas.bind( this );
	}

	onWindowResize = () => {
		if (this.state.library) {
			this.state.library.onWindowResize();
		}
	};
	

	private refresh(props: Readonly<ParticlesProps>): void {
		if (this.state.canvas) {
			// If a system has been set in the props
			if (props.system) {
				// If the actual system is not an instance of the passed system
				if (!(this.system instanceof props.system)) {
					this.system = new props.system(this.systemLibraryProxy);
				}
			} else {
				// No system set, go with a default one
				if (!(this.system instanceof DefaultParticleSystem)) {
					this.system = this.buildDefaultSystem(props, this.state.canvas);
				} else {
					// Use children
					(this.system as DefaultParticleSystem).setParticles(React.Children.toArray(props.children) as any)
				}
			}
			// (should check if different)
			this.state.library.setSystem(this.system);
		}
	}

	private buildDefaultSystem(props: Readonly<ParticlesProps>, canvas: HTMLCanvasElement): DefaultParticleSystem {
		// Build a new default particle system
		const system = new DefaultParticleSystem();
		system.buildSystemFromParams(props.params as IParams);
		const childrenCount = React.Children.count(props.children);
		if (!childrenCount) {
			// Use params
			const params = deepExtend(getDefaultParams(), props.params);
			system.buildParticlesFromParams(params, canvas);
		} else {
			// Use children
			system.setParticles(React.Children.toArray(props.children) as any)
		}
		return system;
	}

	destroy(){
		this.state.library.destroy();
	}

	loadCanvas( canvas: HTMLCanvasElement ){
		if( canvas ){
			this.setState({
				canvas
			}, () => {
				this.systemLibraryProxy.setCanvas(canvas);
				this.state.library.loadCanvas( this.state.canvas );
				if (!this.props.system) {
					this.system = this.buildDefaultSystem(this.props, canvas);
				} else {
					this.system = new this.props.system(this.systemLibraryProxy);
				}
				this.state.library.setSystem(this.system);
				this.state.library.start();
			});
		}
	}

	componentWillUpdate(nextProps: Readonly<ParticlesProps>) {
		if (this.props !== nextProps) {
			this.refresh(nextProps);
		}
	}

	forceUpdate() {
		this.refresh(this.props);
		super.forceUpdate();
	}

	componentWillMount(){
		const children = this.props.children as ReactChildren;
		const library = new ParticlesLibrary( this.props.params );
		window.addEventListener('resize', this.onWindowResize);
		this.setState({
			library
		}, () => {
			this.systemLibraryProxy.setNotifyClosure(() => {
				if (this.system)
					this.state.library.setSystem(this.system);
			});
		});
	}
	
	componentWillUnmount(){
		this.destroy();
		this.setState({
			library: undefined
		});
		window.removeEventListener('resize', this.onWindowResize);
	}

	render(){
		let {width, height, className, canvasClassName} = this.props;
		return (
			<div className={className}>
				<canvas ref={this.loadCanvas} className={canvasClassName} style={
					deepExtend(deepClone(this.props.style), {
						width,
						height
					})
				}>
				</canvas>
			</div>
		);
	}

}