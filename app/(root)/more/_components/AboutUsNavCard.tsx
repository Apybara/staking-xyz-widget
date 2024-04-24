import * as NavCard from "../../_components/NavCard";

export const AboutUsNavCard = (props: NavCard.PageNavCardProps) => {
  return (
    <NavCard.Card
      {...props}
      title="About us"
      description="Making staking easy for everyone"
      externalUrl="#"
      arrowPosition="right"
    />
  );
};
