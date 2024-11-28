export type Gesture = "Open_Palm" | "Close_Fist" | null;

export type GestureResult = {
  gesture: Gesture;
  confident: number;
};
