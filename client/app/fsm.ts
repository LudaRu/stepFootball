export class FSM {
  activeState: any;

  public function;

  FSM() {
  }

  setState(state: any): void {
    this.activeState = state;
  }

  update(): void {
    if (this.activeState !== null) {
      this.activeState();
    }
  }
}
