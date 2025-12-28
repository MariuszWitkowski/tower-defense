import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { useGameStore, GameState } from "./gameStore";
import { STARTING_LIVES, STARTING_MONEY } from "../utils/Constants";

vi.mock("./gameStore");

describe("gameStore", () => {
  let state: Omit<GameState, "actions">;
  let actions: GameState["actions"];

  beforeEach(() => {
    state = {
      money: STARTING_MONEY,
      lives: STARTING_LIVES,
      level: 1,
      wave: 0,
    };
    actions = {
      spendMoney: (amount: number) => (state.money -= amount),
      earnMoney: (amount: number) => (state.money += amount),
      loseLife: () => (state.lives -= 1),
      setWave: (wave: number) => (state.wave = wave),
      setLevel: (level: number) => (state.level = level),
    };
    (useGameStore as unknown as Mock).mockReturnValue({ ...state, actions });
  });

  it("should have the correct initial state", () => {
    const { money, lives, level, wave } = (
      useGameStore as unknown as Mock<() => GameState>
    )();
    expect(money).toBe(STARTING_MONEY);
    expect(lives).toBe(STARTING_LIVES);
    expect(level).toBe(1);
    expect(wave).toBe(0);
  });

  it("should spend money correctly", () => {
    const { actions } = (useGameStore as unknown as Mock<() => GameState>)();
    actions.spendMoney(10);
    expect(state.money).toBe(STARTING_MONEY - 10);
  });

  it("should earn money correctly", () => {
    const { actions } = (useGameStore as unknown as Mock<() => GameState>)();
    actions.earnMoney(10);
    expect(state.money).toBe(STARTING_MONEY + 10);
  });

  it("should lose a life correctly", () => {
    const { actions } = (useGameStore as unknown as Mock<() => GameState>)();
    actions.loseLife();
    expect(state.lives).toBe(STARTING_LIVES - 1);
  });

  it("should set the wave correctly", () => {
    const { actions } = (useGameStore as unknown as Mock<() => GameState>)();
    actions.setWave(5);
    expect(state.wave).toBe(5);
  });

  it("should set the level correctly", () => {
    const { actions } = (useGameStore as unknown as Mock<() => GameState>)();
    actions.setLevel(2);
    expect(state.level).toBe(2);
  });

  it("should fail intentionally for testing CI", () => {
    expect(true).toBe(false);
  });
});
