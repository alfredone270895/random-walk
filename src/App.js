import React, { Component } from "react";
import './App.css';
import AwesomeSlider from "react-awesome-slider";
import First from "./pages/First";
import Second from "./pages/Second";
import Third from "./pages/Third";
import Fourth from "./pages/Fourth";
import Five from "./pages/Five";
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import AnimationStyles from 'react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss';
import Sixth from "./pages/Sixth";
const slider = (
    <AwesomeSlider>
        <div><First/></div>
        <div><Five/></div>
        <div><Third/></div>
        <div><Second/></div>
        <div><Fourth/></div>
        <div><Sixth/></div>
    </AwesomeSlider>
);
export default function App(){
    return slider
}
