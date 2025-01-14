import React from "react";
import ambassadors, {
  type Ambassador,
  type AmbassadorKey,
} from "@alveusgg/data/src/ambassadors/core";
import enclosures, { type EnclosureKey } from "@alveusgg/data/src/enclosures";
import Image, { type StaticImageData } from "next/image";
import { getAmbassadorImages } from "@alveusgg/data/src/ambassadors/images";
import { hosts } from "@alveusgg/data/src/animal-quest";
// import { staff } from "@/pages/about/staff";
import mayaImage from "@/assets/maya.png";
import { classes } from "@/utils/classes";
import Heading from "./Heading";

export type StaffImage = StaticImageData & {
  alt: string;
};

// type StaffMember = {
//   name: string;
//   title: string;
//   img: ImageProps | StaffImage;
//   description?: JSX.Element;
// };

// type Staff = Array<StaffMember>;

export type StaffMemberKey = keyof typeof hosts;

export type ProfileCardProps = {
  linkPosition: DOMRect | undefined;
} & (
  | { type: "ambassador"; itemKey: AmbassadorKey }
  | { type: "enclosure"; itemKey: EnclosureKey }
  | { type: "staff"; itemKey: StaffMemberKey }
);

type AmbassadorCardProps = {
  itemKey: AmbassadorKey;
  upwards?: boolean;
};
type EnclosureCardProps = {
  itemKey: EnclosureKey;
  upwards?: boolean;
};
type StaffCardProps = {
  itemKey: StaffMemberKey;
  upwards?: boolean;
};

// const allStaff: Staff = Object.values(staff).map((person) => ({
//   img: { ...person.image, alt: `${person.name}'s picture` },
//   name: person.name,
//   title: person.title,
//   description: person.description,
// }));

// allStaff.push({
//   img: { ...mayaImage, alt: "Maya's picture" },
//   name: "Maya Higa",
//   title: "Founder",
// });

const calcDistance = (position: DOMRect) => {
  const elemPosition = position;
  const vwHeight = window.innerHeight;

  const bottom = vwHeight - elemPosition.bottom;
  const top = elemPosition.top;

  return top > bottom;
};

type SpanProps = {
  title: string;
  name?: Ambassador["species"] | undefined;
};

const Span: React.FC<SpanProps> = ({ title, name }) => {
  return (
    <div className="inline text-yellow-300">
      {title}:<span className="font-semibold"> {name} </span>
    </div>
  );
};

const staffStyle =
  "absolute z-50 flex flex-col lg:flex-row  box-border  max-w-[448px] gap-4 items-center rounded bg-alveus-green-900 p-4 shadow-lg shadow-alveus-green-800";

const ambassadorStyle =
  "absolute z-50 flex flex-col xl:flex-row  -translate-x-1/8 -mt-[25px] items-center gap-1 xl:gap-4 max-w-[340px]  rounded  bg-alveus-green-900 p-4 shadow-lg shadow-alveus-green-800";

const enclosureStyle =
  "absolute z-50 flex flex-col items-center justify-center rounded bg-alveus-green-900 p-2 shadow-lg shadow-alveus-green-800";

const AmbassadorCard: React.FC<AmbassadorCardProps> = ({
  itemKey,
  upwards,
}) => {
  const ambassadorInfo = ambassadors[itemKey];

  const name = ambassadorInfo.name;
  const species = ambassadorInfo.species;
  const enclosure = enclosures[ambassadorInfo.enclosure].name;
  const img = getAmbassadorImages(itemKey)[0];

  return (
    <div
      className={classes(
        ambassadorStyle,
        upwards ? "-translate-y-full" : "mt-4"
      )}
    >
      {
        <Image
          src={img.src}
          alt={img.alt}
          width="176"
          height="176"
          className="h-28 w-auto rounded xl:h-24 xl:w-24 xl:rounded-full"
        />
      }
      <div className="flex flex-col text-sm">
        <Heading className="mb-1 inline text-xl text-yellow-500" level={5}>
          {name}
        </Heading>
        <Span title="Species" name={species} />
        <Span title="Enclosure" name={enclosure} />
      </div>
    </div>
  );
};
const EnclosureCard: React.FC<EnclosureCardProps> = ({ itemKey, upwards }) => {
  const inhabiting = Object.entries(ambassadors).filter(
    (ambassador) => ambassador[1].enclosure === itemKey
  );
  const imgs = inhabiting
    .slice(0, 4)
    .map((ambassador) => {
      const ambaKey: string = ambassador[0];
      return getAmbassadorImages(ambaKey as AmbassadorKey)[0];
    })
    .map((image, id) => (
      <Image
        key={id}
        alt={image.alt}
        src={image.src}
        className="h-20 w-20 rounded border border-yellow-600"
      />
    ));

  return (
    <div
      className={classes(
        enclosureStyle,
        upwards ? "-translate-y-full" : "mt-6"
      )}
    >
      <Heading className="mb-1 inline text-xl text-yellow-500" level={5}>
        Inhabitants:
      </Heading>
      <div className="flex w-44 flex-wrap  items-center justify-center gap-1">
        {imgs}
      </div>
    </div>
  );
};

const StaffCard: React.FC<StaffCardProps> = ({ itemKey, upwards }) => {
  const host = hosts[itemKey];
  const img = { src: mayaImage, alt: "picture of Maya" };

  return (
    <div
      className={classes(staffStyle, upwards ? "-translate-y-full" : "mt-4")}
    >
      {img && (
        <Image
          src={img.src}
          alt={img.alt}
          width="176"
          height="176"
          className="h-28 w-auto rounded xl:h-28 xl:w-auto"
        />
      )}
      <div className="flex flex-col text-sm">
        <Heading className="inline text-xl text-yellow-500" level={5}>
          {host.name}
        </Heading>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  type,
  itemKey,
  linkPosition,
}) => {
  const upwards = linkPosition && calcDistance(linkPosition);

  return (
    <>
      {type === "ambassador" && (
        <AmbassadorCard itemKey={itemKey} upwards={upwards} />
      )}

      {type === "staff" && <StaffCard itemKey={itemKey} upwards={upwards} />}

      {type === "enclosure" && (
        <EnclosureCard itemKey={itemKey} upwards={upwards} />
      )}
    </>
  );
};

export default ProfileCard;
