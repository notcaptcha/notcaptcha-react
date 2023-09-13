export interface RangeProps {
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  value: number;
}
