'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/base/lib';
import { Pagination as PaginationType } from '@/base/types';

import {
  Pagination as PaginationComp,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

export function Pagination({ pagination }: { pagination: PaginationType }) {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPrevPage = () => {
    if (!pagination.hasPreviousPage) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', (pagination.currentPage - 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const navigateToNextPage = () => {
    if (!pagination.hasNextPage) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', (pagination.currentPage + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PaginationComp>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              'pointer-events-none opacity-50': !pagination.hasPreviousPage,
            })}
            onClick={() => navigateToPrevPage()}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={pagination.currentPage !== 1 ? () => navigateToPage(1) : undefined}
            isActive={pagination.currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {pagination.currentPage - 1 > 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {pagination.currentPage > 1 && (
          <PaginationItem>
            <PaginationLink isActive={true}>{pagination.currentPage}</PaginationLink>
          </PaginationItem>
        )}
        {pagination.totalPage - pagination.currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {pagination.totalPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => navigateToPage(pagination.totalPage)}
              isActive={pagination.currentPage === pagination.totalPage}
            >
              {pagination.totalPage}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn({
              'pointer-events-none opacity-50': !pagination.hasNextPage,
            })}
            onClick={() => navigateToNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComp>
  );
}

export function PaginationSkeleton() {
  return (
    <PaginationComp>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </PaginationComp>
  );
}
