import Image from 'next/image';
import {
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Advisor } from '@/services/data/advisors';

interface AdvisorCardProps {
  advisor: Advisor;
}

export default function AdvisorCard({ advisor }: AdvisorCardProps) {
  const {
    id,
    firmName,
    advisorName,
    tagline,
    photo,
    location,
    specializations,
    verifiedBySpring,
  } = advisor;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-transparent bg-white shadow-md transition-all duration-300 hover:border-spring-green hover:shadow-xl">
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <Image
            src={photo}
            alt={firmName}
            className="h-full w-full object-cover object-center"
            width={400}
            height={300}
            unoptimized
          />
        </div>
        {verifiedBySpring && (
          <div className="absolute right-3 top-3 inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-sm font-semibold text-spring-green backdrop-blur-sm">
            <CheckCircle size={16} className="mr-1.5" />
            Verified
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-4">
        <div className="mb-2 flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2" />
          {location}
        </div>
        <h3 className="mb-1 text-xl font-bold text-gray-900">{firmName}</h3>
        <p className="mb-3 text-sm text-gray-500">{advisorName}</p>
        <p className="mb-4 line-clamp-2 text-sm text-gray-700">{tagline}</p>
        
        <div className="flex flex-wrap gap-2">
          {specializations.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="secondary">
              {spec}
            </Badge>
          ))}
          {specializations.length > 3 && (
            <Badge variant="secondary">+{specializations.length - 3} more</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/services/advisor-detail/${id}`}
          className="flex h-11 w-full items-center justify-center rounded-md bg-spring-green px-6 text-base font-semibold text-white transition-colors hover:bg-spring-green/90"
        >
          View Profile
        </Link>
      </CardFooter>
    </Card>
  );
}
