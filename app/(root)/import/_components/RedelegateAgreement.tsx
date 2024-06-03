import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { Checkbox } from "@/app/_components/Checkbox";
import { useRedelegating } from "@/app/_contexts/RedelegatingContext";
import { RedelegateCTA } from "./RedelegateCTA";

export const RedelegateAgreement = () => {
  const { isAgreementChecked, setStates } = useRedelegating();

  return (
    <WidgetBottomBox>
      <Checkbox
        checked={isAgreementChecked}
        onChange={({ target }) => {
          setStates({ isAgreementChecked: target.checked });
        }}
        label="Agree to import all my stakes"
      />

      <RedelegateCTA />
    </WidgetBottomBox>
  );
};
