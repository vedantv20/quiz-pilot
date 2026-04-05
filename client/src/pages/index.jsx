export { Landing } from './Landing'
export { Login } from './Login'
export { Register } from './Register'
export { Dashboard } from './Dashboard'
export { Subjects } from './Subjects'
export { SubjectDetail } from './SubjectDetail'
export { QuizDetail } from './QuizDetail'
export { QuizAttempt } from './QuizAttempt'
export { QuizResult } from './QuizResult'
export { Survey } from './Survey'
export { Bookmarks } from './Bookmarks'
export { Profile } from './Profile'
export { default as Onboarding } from './Onboarding'

export { default as Leaderboard } from './Leaderboard'
export { default as TeacherDashboard } from './TeacherDashboard'
export { default as CreateQuiz } from './CreateQuiz'
export { default as EditQuiz } from './EditQuiz'
export { default as NewQuestion } from './NewQuestion'
export const QuizStats = () => {
  return (
    <div className="page-shell">
      <div className="page-container">
        <h1 className="text-3xl font-bold text-foreground">Quiz Stats - Coming Soon</h1>
      </div>
    </div>
  )
}
export { default as AdminDashboard } from './AdminDashboard'
export { default as UserManagement } from './UserManagement'
export const SubjectManagement = () => {
  return (
    <div className="page-shell">
      <div className="page-container">
        <h1 className="text-3xl font-bold text-foreground">Subject Management - Coming Soon</h1>
      </div>
    </div>
  )
}
export { default as SurveyAnalytics } from './SurveyAnalytics'

export const NotFound = () => {
  return (
    <div className="page-shell flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-5">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}



