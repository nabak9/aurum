<p align="center">
  <img src="https://i.imgur.com/Ru8maJS.png" width="100" alt="Aurum">
</p>

# Fast and concise declarative DOM rendering library for javascript

Aurumjs is a DOM rendering library inspired by react and angular.
In Aurum you define your DOM using JSX and each thing that can change, be it attributes or inner text can be assigned to a data source.
There is no rerendering, no reconciliation, no watching no dirty checking and no guesswork on what will and will cause things to render.

Instead all the things that can change are bound to a so called data source which makes data mutations
observable and then applies the changes directly to the DOM bypassing any need for virtual dom or heavy computations of any sort.
This makes it very fast to apply updates while keeping the code short.

This project is and will always be dependency free for better security and performance
This project is still a very early prototype not suited for any serious project yet but feel free to try it and make bug reports or suggestions.

To get started simply run

> npm install aurumjs

Examples, proper documentation and benchmarks will be added in the near future.
