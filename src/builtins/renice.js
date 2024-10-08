import { BaseFSM } from "../base-fsm.js";

export class ReniceFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.nicenessSeen = false;
    this.targetSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      renice: this.handleRenice.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      niceness: this.handleNiceness.bind(this),
      target: this.handleTarget.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'r' ? "renice" : "invalid";
  }

  handleRenice(char) {
    if ("enice".indexOf(char) !== -1) return "renice";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.nicenessSeen && /[0-9-]/.test(char)) return "niceness";
    if (!this.targetSeen) {
      this.targetSeen = true;
      return "target";
    }
    if (char === undefined) return this.targetSeen ? "valid" : "invalid";
    return "target";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    return "option";
  }

  handleNiceness(char) {
    if (char === ' ' || char === '\t') {
      this.nicenessSeen = true;
      return "space";
    }
    if (/[0-9]/.test(char)) return "niceness";
    if (char === undefined) return "invalid";
    return "invalid";
  }

  handleTarget(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "target";
  }

  isValid(command) {
    this.state = "start";
    this.nicenessSeen = false;
    this.targetSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
