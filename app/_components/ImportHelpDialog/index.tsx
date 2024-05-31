import { useDialog } from "@/app/_contexts/UIContext";
import * as Dialog from "../Dialog";
import { Icon } from "../Icon";

import * as S from "./importHelpDialog.css";

export const ImportHelpDialog = () => {
  const { open, toggleOpen } = useDialog("importHelp");

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        toggleOpen(!open);
      }}
    >
      <Dialog.Main>
        <Dialog.Content className={S.content}>
          <div className={S.topBox}>
            <Icon name="check" size={40} />
            <h1 className={S.title}>Import your staking position to enjoy the following benefits</h1>
          </div>

          <ul className={S.benefits}>
            {/* <li className={S.benefitsItem}>Auto compounding</li> */}
            <li className={S.benefitsItem}>Staking position guardian</li>
            <li className={S.benefitsItem}>Increase network decentralization</li>
          </ul>

          <button className={S.button} onClick={() => toggleOpen(false)}>
            Got it
          </button>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
