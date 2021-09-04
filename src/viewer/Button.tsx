import React from "react";

const Button: React.FC<JSX.IntrinsicElements['button'] & { icon: string }> = ({icon, style, ...props}) =>
    <button
        className="hide-button-unless-hovered"
        style={{verticalAlign: "middle", ...style}}
        {...props}>{icon}</button>;

Button.displayName = 'Button';
export default Button;
