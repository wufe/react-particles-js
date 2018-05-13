import * as React from 'react';
import { Component } from 'react';
import { TShapeType, TMoveDirection, TOutMode, TOutModeRemoveBorder } from '../interfaces';

export interface IParticleElementProps {

    id: any; // Unique identifier
    // color
    color?: string;

    // shape
    shapeType?: TShapeType;
    // stroke
    strokeWidth?: number;
    strokeColor?: string;
    // polygon
    polygonSides?: number;
    // image
    imageSrc?: string;
    imageWidth?: number;
    imageHeight?: number;

    // opacity
    opacityValue?: number;
    opacityRandomness?: boolean;
    // animation
    opacityAnimationEnabled?: boolean;
    opacityAnimationSpeed?: number;
    opacityAnimationMinimum?: number;
    opacityAnimationSync?: boolean;

    // size
    sizeValue?: number;
    sizeRandomness?: boolean;
    sizeAnimationEnabled?: boolean;
    sizeAnimationSpeed?: number;
    sizeAnimationMinimum?: number;
    sizeAnimationSync?: boolean;

    // line linked
    lineLinkedEnabled?: boolean;
    lineLinkedDistance?: number;
    lineLinkedColor?: string | 'none';
    lineLinkedOpacity?: number;
    lineLinkedWidth?: number;
    lineLinkedShadowEnabled?: boolean;
    lineLinkedShadowBlur?: number;
    lineLinkedShadowColor?: string | 'none';

    // move
    moveEnabled?: boolean;
    moveSpeed?: number;
    moveDirection?: TMoveDirection;
    moveRandomness?: boolean;
    moveStraight?: boolean;
    moveOutMode?: TOutMode;
    moveOutModeRemoveBorders?: TOutModeRemoveBorder[];
    moveOutModeRemoveFallback?: Exclude<TOutMode, 'remove'>;
    moveBounce?: boolean // Particles bouncing each other
    moveAttractEnabled?: boolean;
    moveAttractDistance?: number;
    moveAttractRotateX?: number;
    moveAttractRotateY?: number;

    // initials
    initialX?: number;
    initialY?: number;

    // TODO: Implement these
    initialAccelerationX?: number;
    initialAccelerationY?: number;
    initialVelocityX?: number;
    initialVelocityY?: number;

    // acceleration
    accelerateWhileVelocityGreaterThan?: number;
    accelerateWhileVelocityLessThan?: number;
}

export class Particle extends Component<IParticleElementProps, any> {

    public static defaultProps: IParticleElementProps = {
        id: Symbol(),
        color: '#D1D1D1',
        shapeType: 'circle',
        opacityValue: .5,
        opacityRandomness: false,
        opacityAnimationEnabled: true,
        opacityAnimationSpeed: .2,
        opacityAnimationMinimum: .1,
        opacityAnimationSync: false,
        sizeValue: 2,
        sizeRandomness: false,
        sizeAnimationEnabled: false,
        lineLinkedEnabled: true,
        lineLinkedDistance: 150,
        lineLinkedColor: '#E1E1E1',
        lineLinkedOpacity: .6,
        lineLinkedWidth: 1,
        lineLinkedShadowEnabled: false,
        lineLinkedShadowColor: 'none',
        lineLinkedShadowBlur: 20,
        moveEnabled: true,
        moveSpeed: 5,
        moveDirection: 'none',
        moveRandomness: false,
        moveStraight: false,
        moveOutMode: 'bounce',
        moveOutModeRemoveBorders: ['top', 'right', 'bottom', 'left'],
        moveOutModeRemoveFallback: 'bounce',
        moveBounce: true,
        moveAttractEnabled: false,
        moveAttractDistance: 150,
        moveAttractRotateX: 600,
        moveAttractRotateY: 1200
    };

    render() {
        return (
            <span>ø</span>
        );
    }
}