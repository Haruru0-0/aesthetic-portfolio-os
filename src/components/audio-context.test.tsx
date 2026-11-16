// @vitest-environment jsdom
import { StrictMode, useContext } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AudioContext, AudioProvider } from "./audio-context";

afterEach(() => { cleanup(); document.querySelectorAll("audio").forEach(audio => audio.remove()); vi.restoreAllMocks(); });

it("keeps progress subscribed after StrictMode reattaches effects", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  function Progress() { const { progress } = useContext(AudioContext); return <output>{progress}</output>; }
  await act(async () => { render(<StrictMode><AudioProvider><Progress /></AudioProvider></StrictMode>); });
  const audio = document.querySelector("audio")!;
  Object.defineProperty(audio, "duration", { configurable: true, value: 200 });
  audio.currentTime = 50;
  act(() => audio.dispatchEvent(new Event("timeupdate")));
  expect(screen.getByRole("status").textContent).toBe("25");
});
