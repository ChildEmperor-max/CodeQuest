import * as THREE from "three";

export default class QuestMaker {
  constructor() {
    this.instruction = undefined;
    this.goal = undefined;
  }
  initialize(instruction, goal) {
    this.instruction = instruction;
    this.goal = goal;
    this.ongoing = false;
    this.completed = false;
    this.failed = false;
  }
}
