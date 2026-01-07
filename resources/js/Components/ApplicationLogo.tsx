import { ImgHTMLAttributes } from 'react';
import logo from "../images/fluxa-nome.svg";

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src={logo}
            alt="Fluxa Logo"
            className={`object-contain ${props.className}`}
        />
    );
}