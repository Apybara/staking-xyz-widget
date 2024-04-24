import * as NavCard from "../../_components/NavCard";

export const HowItWorksNavCard = (props: NavCard.PageNavCardProps) => {
  return (
    <NavCard.Card
      {...props}
      title="How it works"
      description="Staking optimizer, compounder, and more"
      externalUrl="#"
      arrowPosition="right"
    />
  );
};
