//cleared tests
import { store } from "../store";

describe("Redux Store", () => {
  it("should initialize with expected state shape", () => {
    const state = store.getState();

    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("posts");
    expect(state).toHaveProperty("error");
  });
});
