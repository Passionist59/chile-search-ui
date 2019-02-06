import React from "react";
import { SearchBoxContainer } from "../SearchBox";
import { shallow } from "enzyme";

const params = {
  searchTerm: "test",
  setSearchTerm: jest.fn()
};

beforeEach(() => {
  params.setSearchTerm = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<SearchBoxContainer {...params} view={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});

it("will keep focus prop in sync with view component", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(false);

  wrapper
    .find("SearchBox")
    .prop("inputProps")
    ["onFocus"]();

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(true);

  wrapper
    .find("SearchBox")
    .prop("inputProps")
    ["onBlur"]();

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(false);
});

it("will call back to setSearchTerm with refresh: false when input is changed", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")({
    currentTarget: {
      value: "new term"
    }
  });

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual(["new term", { refresh: false }]);
});

it("will call back to setSearchTerm with refresh: true when input is changed and searchAsYouType is true", () => {
  const wrapper = shallow(
    <SearchBoxContainer {...params} searchAsYouType={true} />
  );

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")({
    currentTarget: {
      value: "new term"
    }
  });

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual(["new term", { refresh: true, debounce: 200 }]);
});

it("will call back to setSearchTerm with a specific debounce when input is changed and searchAsYouType is true and a debounce is provided", () => {
  const wrapper = shallow(
    <SearchBoxContainer
      {...params}
      searchAsYouType={true}
      debounceLength={500}
    />
  );

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")({
    currentTarget: {
      value: "new term"
    }
  });

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual(["new term", { refresh: true, debounce: 500 }]);
});

it("will call back setSearchTerm with refresh: true when form is submitted", () => {
  const wrapper = shallow(
    <SearchBoxContainer {...params} searchTerm="a term" />
  );

  wrapper.find("SearchBox").prop("onSubmit")({
    preventDefault: () => {}
  });

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual(["a term"]);
});
