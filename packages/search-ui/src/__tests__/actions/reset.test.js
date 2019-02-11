import { DEFAULT_STATE } from "../../SearchDriver";
import { setupDriver } from "../../test/helpers";

describe("#reset", () => {
  it("Resets state back to the initial state provided at initialization", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc"
    };

    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.setSearchTerm("test");
    let updatedStated = updatedStateAfterAction.state;

    expect(updatedStated).not.toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });

    driver.reset();
    updatedStated = updatedStateAfterAction.state;

    expect(updatedStated).toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });
  });
});
