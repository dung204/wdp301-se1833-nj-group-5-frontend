import { Destination } from '@/modules/users/pages/home/destinations/page';
import { Discount } from '@/modules/users/pages/home/discount/page';
import { Famous } from '@/modules/users/pages/home/famous/page';
import { Section } from '@/modules/users/pages/home/section/page';

export default function UserHomePage() {
  return (
    <div className="p-4">
      <Section />
      <div className="flex justify-center px-16">
        <div className="w-full max-w-[1200px]">
          <Destination />
          <Discount />
          <Famous />
        </div>
      </div>
    </div>
  );
}
