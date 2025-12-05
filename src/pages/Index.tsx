import { StudyDashboard } from '@/components/study/StudyDashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Study Tracker - Track Your Learning Progress</title>
        <meta name="description" content="Track your daily study hours, set goals, and monitor your progress with our beautiful study tracker. Features subject-wise breakdown, weekly and monthly totals." />
      </Helmet>
      <StudyDashboard />
    </>
  );
};

export default Index;
