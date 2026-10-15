"use client";
import * as Primitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

type Option = string | { value: string; label: string; disabled?: boolean };
type Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "onChange" | "children"
> & {
  value: string;
  options: readonly Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
};
const emptyValue = "__navonixx_empty_option__";
export function Select({
  value,
  options,
  onValueChange,
  placeholder = "Select an option",
  disabled,
  className = "",
  ...props
}: Props) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContainer(
      trigger.current?.closest<HTMLElement>(".admin-site, .public-site") ||
        document.body,
    );
  }, []);
  const hasEmpty = options.some(
    (item) => typeof item !== "string" && item.value === "",
  );
  return (
    <Primitive.Root
      value={value === "" && hasEmpty ? emptyValue : value}
      onValueChange={(next) => onValueChange(next === emptyValue ? "" : next)}
      disabled={disabled}
    >
      <Primitive.Trigger
        ref={trigger}
        {...props}
        className={`nx-select ${className}`}
      >
        <span className="nx-select-value">
          <Primitive.Value placeholder={placeholder} />
        </span>
        <Primitive.Icon className="nx-select-chevron">
          <ChevronDown size={16} />
        </Primitive.Icon>
      </Primitive.Trigger>
      <Primitive.Portal container={container}>
        <Primitive.Content
          position="popper"
          align="start"
          sideOffset={7}
          collisionPadding={12}
          className="nx-select-menu"
        >
          <Primitive.ScrollUpButton className="nx-select-scroll">
            <ChevronUp size={15} />
          </Primitive.ScrollUpButton>
          <Primitive.Viewport className="nx-select-viewport">
            {options.map((item) => {
              const option =
                typeof item === "string" ? { value: item, label: item } : item;
              return (
                <Primitive.Item
                  key={option.value}
                  value={option.value === "" ? emptyValue : option.value}
                  disabled={option.disabled}
                  className="nx-select-option"
                >
                  <Primitive.ItemText>{option.label}</Primitive.ItemText>
                  <Primitive.ItemIndicator className="nx-select-check">
                    <Check size={15} strokeWidth={2.5} />
                  </Primitive.ItemIndicator>
                </Primitive.Item>
              );
            })}
          </Primitive.Viewport>
          <Primitive.ScrollDownButton className="nx-select-scroll">
            <ChevronDown size={15} />
          </Primitive.ScrollDownButton>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
