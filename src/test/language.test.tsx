import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider, useI18n, type AppLanguage, LANGUAGE_STORAGE_KEY } from "@/lib/language";

const Probe = () => {
  const { language, setLanguage, t } = useI18n();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="label">{t("设置", "Settings")}</span>
      <button onClick={() => setLanguage("en-US")}>switch</button>
    </div>
  );
};

describe("LanguageProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to zh-CN and persists language changes", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("language")).toHaveTextContent("zh-CN");
    expect(screen.getByTestId("label")).toHaveTextContent("设置");

    fireEvent.click(screen.getByText("switch"));

    expect(screen.getByTestId("language")).toHaveTextContent("en-US");
    expect(screen.getByTestId("label")).toHaveTextContent("Settings");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en-US");
  });

  it("restores persisted language on mount", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en-US" satisfies AppLanguage);

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("language")).toHaveTextContent("en-US");
    expect(screen.getByTestId("label")).toHaveTextContent("Settings");
  });
});
