import React from "react";
import { shallow } from "enzyme";
import { ResultsContainer } from "../Results";

const params = {
  results: [
    {
      data: { foo: "foo" },
      getRaw: val => val,
      getSnippet: val => `<em>${val}</em>`
    },
    {
      data: { bar: "bar" },
      getRaw: val => val,
      getSnippet: val => `<em>${val}</em>`
    }
  ],
  trackClickThrough: jest.fn(),
  titleField: "title",
  urlField: "url"
};

beforeEach(() => {
  params.trackClickThrough = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<ResultsContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("supports a render prop", () => {
  const render = ({ children }) => {
    return <div>{children}</div>;
  };
  const wrapper = shallow(<ResultsContainer {...params} render={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});

it("supports an individual result render prop", () => {
  const renderResult = ({ title }) => {
    return <li>{title}</li>;
  };
  const wrapper = shallow(
    <ResultsContainer {...params} renderResult={renderResult} />
  );
  expect(wrapper.find(renderResult).map(n => n.dive())).toMatchSnapshot();
});

it("will call back when a document link is clicked in the view", () => {
  const wrapper = shallow(<ResultsContainer {...params} />);

  wrapper
    .find("Result")
    .at(0)
    .prop("onClickLink")();

  const clickThrough = params.trackClickThrough.mock.calls[0][0];
  expect(clickThrough).toEqual("id");
});
