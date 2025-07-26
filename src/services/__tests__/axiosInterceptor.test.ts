//cleared tests
import MockAdapter from "axios-mock-adapter";
import api from "../axiosInterceptor"; // path to your interceptor file
import { store } from "../../redux/Store/store";
import { SET_API_ERROR } from "../../redux/Actions/errorAction";

describe("axios interceptor", () => {
  let mock: MockAdapter;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    mock = new MockAdapter(api);
    dispatchSpy = jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    mock.restore();
    dispatchSpy.mockRestore();
  });

  it("should dispatch SET_API_ERROR on API error", async () => {
    mock.onGet("/error-endpoint").reply(500); // Simulate error

    try {
      await api.get("/error-endpoint");
    } catch (error) {
      // expected
    }

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: SET_API_ERROR,
      payload: true,
    });
  });

  it("should NOT dispatch SET_API_ERROR on success", async () => {
    mock.onGet("/success-endpoint").reply(200, { message: "OK" });

    const response = await api.get("/success-endpoint");

    expect(response.status).toBe(200);
    expect(dispatchSpy).not.toHaveBeenCalledWith({
      type: SET_API_ERROR,
      payload: true,
    });
  });
});
