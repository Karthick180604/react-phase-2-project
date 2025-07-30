import MockAdapter from "axios-mock-adapter";
import api from "../axiosInterceptor";
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
