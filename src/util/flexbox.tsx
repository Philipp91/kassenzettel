import {Property} from 'csstype';
import React, {CSSProperties} from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

interface SupportedFlexProps extends DivProps, React.RefAttributes<HTMLDivElement> {
    style?: CSSProperties; // Just passed through.
    // The following JSX-level attributes are passed into the style as well. The type declarations come from index.d.ts
    // in the csstype module.
    flexWrap?: Property.FlexWrap;
    alignItems?: Property.AlignItems;
    justifyContent?: Property.JustifyContent;
}

const flexProps = (
    {
        style,
        flexWrap, alignItems, justifyContent,
        ...props
    }: SupportedFlexProps,
    moreStyle?: CSSProperties
): DivProps => ({
    ...props,
    style: {
        display: 'flex',
        ...moreStyle,
        flexWrap, alignItems, justifyContent,
        ...style,
    },
});

type OutputDivElement = React.DetailedReactHTMLElement<DivProps, HTMLDivElement>;
export const FlexRow = (props: SupportedFlexProps): OutputDivElement =>
    React.createElement('div', flexProps(props, {flexDirection: 'row'}));
export const FlexCol = (props: SupportedFlexProps): OutputDivElement =>
    React.createElement('div', flexProps(props, {flexDirection: 'column'}));
