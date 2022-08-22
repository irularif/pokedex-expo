import React, { JSXElementConstructor } from "react";
import { View } from "react-native";
import { render, fireEvent, act } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export { fireEvent, act };

// for getting findByType e.g. wrapper.findByType(Icon) see implementation in Avatar Component
export const renderWithWrapper = (
  children: React.ReactElement<any, string | JSXElementConstructor<any>>
) => {
  const options = {
    wrapper: (props: any) => (
      <SafeAreaProvider>
        <View {...props} testID="wrapper" />
      </SafeAreaProvider>
    ),
  };
  const renderApi = render(children, options);
  const wrapper = renderApi.queryByTestId("wrapper")!;
  return { wrapper, ...renderApi };
};
