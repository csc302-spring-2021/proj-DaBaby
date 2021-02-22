import React from "react";

import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SDCSection from "../components/SDCSection";

test("Rendering and submitting form with valid input", async () => {
  render(<SDCSection />);

  await waitFor(() => {
    userEvent.type(screen.getByPlaceholderText("H123FA456"), "abc123");
  });

  await waitFor(() => {
    userEvent.click(screen.getByRole("button"));
  });

  await waitFor(() => screen.getByTestId("caseIdValidation"));
  await waitFor(() => {
    expect(screen.getByTestId("caseIdValidation")).toHaveTextContent("");
  });
});

test("Rendering and submitting form with invalid input", async () => {
  render(<SDCSection />);

  await waitFor(() => {
    userEvent.click(screen.getByRole("button"));
  });

  await waitFor(() => screen.getByTestId("caseIdValidation"));
  await waitFor(() => {
    expect(screen.getByTestId("caseIdValidation")).toHaveTextContent(
      "Required"
    );
  });
});
