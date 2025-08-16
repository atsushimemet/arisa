import { Suspense } from 'react';
import { ResultsClient } from './results-client';

export const dynamic = 'force-dynamic'; // optional but recommended

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsClient />
    </Suspense>
  );
}