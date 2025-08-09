/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  // AlertCircle,
  Play,
} from 'lucide-react';

import { RootState } from '../store';
import { UserRole, AssessmentStep } from '../types';
import { useGetDashboardStatsQuery } from '../store/api/userApi';
import { useGetUserAssessmentsQuery } from '../store/api/assessmentApi';
import { useGetMyCertificatesQuery } from '../store/api/certificateApi';
import { getNextEligibleStep, getLevelColor } from '../utils/helpers';

import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);
  
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery(
    undefined,
    { skip: user?.role !== UserRole.ADMIN }
  );
  
  const { data: assessmentsData } = useGetUserAssessmentsQuery(
    { page: 1, limit: 5 },
    { skip: user?.role === UserRole.ADMIN }
  );
  
  const { data: certificatesData } = useGetMyCertificatesQuery(
    { page: 1, limit: 3 },
    { skip: user?.role === UserRole.ADMIN }
  );

  const handleStartAssessment = () => {
    const nextStep = getNextEligibleStep(user?.currentLevel || 'none');
    if (nextStep) {
      navigate('/assessments', { state: { startStep: nextStep } });
    }
  };

  const renderAdminDashboard = () => {
    if (statsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    const stats = statsData?.data;

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assessments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalAssessments || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalCertificates || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.completionRate || 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Distribution */}
        {stats?.levelDistribution && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Level Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.levelDistribution).map(([level, count]) => (
                <div key={level} className="text-center">
                  <p className={`text-2xl font-bold ${getLevelColor(level as any)}`}>
                    {count as number}
                  </p>
                  <p className="text-sm text-gray-500">{level}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              icon={Users}
              onClick={() => navigate('/users')}
              fullWidth
            >
              Manage Users
            </Button>
            <Button
              variant="secondary"
              icon={BookOpen}
              onClick={() => navigate('/questions')}
              fullWidth
            >
              Manage Questions
            </Button>
            <Button
              variant="outline"
              icon={Award}
              onClick={() => navigate('/certificates')}
              fullWidth
            >
              View Certificates
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    const nextStep = getNextEligibleStep(user?.currentLevel || 'none');
    const recentAssessments = assessmentsData?.data || [];
    const certificates = certificatesData?.data || [];

    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600 mb-4">
                Your current level: <span className={`font-semibold ${getLevelColor(user?.currentLevel || 'none')}`}>
                  {user?.currentLevel || 'Not assessed'}
                </span>
              </p>
              {nextStep && (
                <Button
                  variant="primary"
                  icon={Play}
                  onClick={handleStartAssessment}
                >
                  Start {nextStep === AssessmentStep.STEP_1 ? 'Initial' : 'Next'} Assessment
                </Button>
              )}
            </div>
            <div className="flex-shrink-0">
              <BookOpen className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assessments */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Assessments
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/assessments')}
              >
                View All
              </Button>
            </div>
            
            {recentAssessments.length > 0 ? (
              <div className="space-y-3">
                {recentAssessments.slice(0, 3).map((assessment) => (
                  <div
                    key={assessment._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        Step {assessment.step}
                      </p>
                      <p className="text-sm text-gray-500">
                        Score: {assessment.score}% - Level: {assessment.level}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {assessment.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No assessments yet</p>
                <p className="text-sm text-gray-400">
                  Start your first assessment to see your progress
                </p>
              </div>
            )}
          </Card>

          {/* Certificates */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                My Certificates
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/certificates')}
              >
                View All
              </Button>
            </div>
            
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {certificate.level} Certificate
                      </p>
                      <p className="text-sm text-gray-500">
                        Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No certificates yet</p>
                <p className="text-sm text-gray-400">
                  Complete assessments to earn certificates
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Learning Path Progress
          </h3>
          <div className="flex items-center justify-between space-x-4">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, index) => {
              const isCompleted = user?.currentLevel && 
                ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(user.currentLevel) >= index;
              const isCurrent = user?.currentLevel === level;
              
              return (
                <div key={level} className="flex-1 text-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-semibold
                      ${isCompleted
                        ? 'bg-green-100 text-green-800'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {level}
                  </div>
                  <p className="text-sm text-gray-600">{level}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  const renderSupervisorDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user?.firstName}!
              </h2>
              <p className="text-gray-600 mb-4">
                Manage assignments and track student progress
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/assignments')}
              >
                Create Assignment
              </Button>
            </div>
            <div className="flex-shrink-0">
              <Users className="h-16 w-16 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Assignment
              </h3>
              <p className="text-gray-600 mb-4">
                Create new assessments for your students
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/assignments')}
              >
                Get Started
              </Button>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Student Progress
              </h3>
              <p className="text-gray-600 mb-4">
                Track your students' assessment results
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/certificates')}
              >
                View Progress
              </Button>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Certificates
              </h3>
              <p className="text-gray-600 mb-4">
                View and manage student certificates
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/certificates')}
              >
                View All
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {user.role === UserRole.ADMIN && 'Manage platform and monitor progress'}
          {user.role === UserRole.STUDENT && 'Track your learning journey and certificates'}
          {user.role === UserRole.SUPERVISOR && 'Create assignments and monitor student progress'}
        </p>
      </div>

      {user.role === UserRole.ADMIN && renderAdminDashboard()}
      {user.role === UserRole.STUDENT && renderStudentDashboard()}
      {user.role === UserRole.SUPERVISOR && renderSupervisorDashboard()}
    </div>
  );
};

export default Dashboard;