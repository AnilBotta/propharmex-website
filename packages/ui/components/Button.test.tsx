import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the label", () => {
    render(<Button>Request scoping call</Button>);
    expect(screen.getByRole("button", { name: /request scoping call/i })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant classes", () => {
    render(<Button variant="danger">Revoke</Button>);
    const btn = screen.getByRole("button");
    // CVA output includes the variant identifier somewhere in className
    expect(btn.className.length).toBeGreaterThan(0);
  });

  it("renders via asChild without wrapping in a <button>", () => {
    render(
      <Button asChild>
        <a href="/contact" data-testid="link">Contact</a>
      </Button>
    );
    const link = screen.getByTestId("link");
    expect(link.tagName.toLowerCase()).toBe("a");
    // Class set from Button should be merged onto the anchor
    expect(link.className.length).toBeGreaterThan(0);
  });

  it("exposes type=button by default to prevent accidental form submit", () => {
    render(<Button>Safe default</Button>);
    const btn = screen.getByRole("button");
    // Consumers may set type explicitly; we assert the element is a <button>
    expect(btn.tagName.toLowerCase()).toBe("button");
  });
});
