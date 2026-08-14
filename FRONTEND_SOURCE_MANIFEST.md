# The Gym Bro — Frontend Source Manifest & Stitch Context Guide

This document catalogs every frontend source file in the project, outlines its role during UI generation with Stitch / 21st.dev, and specifies the minimal context required for external frontend generators.

---

## 1. Complete Source Code File Manifest

### Pages (`src/pages/`)

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/pages/DashboardPage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/pages/DashboardPage.jsx) | Main workout generator page. Integrates `WorkoutForm`, `Spinner`, and `ResultsDashboard`. Fetches plan from API or client fallback. | **Critical** | **Yes** (Essential layout & state flow) | Safe to replace JSX/CSS shell; preserve API fetch & goal syncing. |
| [`src/pages/LoginPage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/pages/LoginPage.jsx) | Standalone full-viewport login route. Renders centered `AuthModal`. Handles post-login redirects. | **Critical** | **Yes** (Standalone layout requirement) | Safe to replace container shell; preserve auth redirect logic. |
| [`src/pages/ProfilePage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/pages/ProfilePage.jsx) | Athlete profile overview. Houses profile header, statistics grid, personal metrics, preferences, and achievements. | **Important** | **Yes** (Primary athlete dashboard) | Safe to replace layout/grid; preserve user data bindings & modal triggers. |
| [`src/pages/SettingsPage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/pages/SettingsPage.jsx) | Account settings & preferences page. Renders `SettingsCard`. | **Important** | **Yes** (Preferences layout) | Safe to replace shell; preserve settings toggles & delete account flow. |
| [`src/pages/CompleteProfilePage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/pages/CompleteProfilePage.jsx) | Onboarding form for mandatory athlete metrics (age, height, weight, goal). | **Important** | **Yes** (Onboarding UX) | Safe to replace form UI; preserve validation rules and `updateUserProfile` call. |

---

### Core Components (`src/components/`)

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/components/Navbar.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/Navbar.jsx) | Top navigation bar with desktop links, login CTA, user avatar menu, and mobile drawer. | **Critical** | **Yes** (Global navigation header) | Safe to redesign; preserve `useAuth()` links, avatar dropdown, and logout. |
| [`src/components/WorkoutForm.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/WorkoutForm.jsx) | 4-step workout generator form (Goal selection, Level selection, conditional options, submit CTA). | **Critical** | **Yes** (Core business form) | Safe to redesign UI/cards; preserve props, state transitions & validation logic. |
| [`src/components/LevelController.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/LevelController.jsx) | Conditional sub-form rendering beginner tips, intermediate split grid, or advanced target muscle checkboxes. | **Critical** | **Yes** (Dynamic form logic) | Safe to redesign UI; preserve selection IDs (`muscle_gain`, `3`, `4`, etc.). |
| [`src/components/ResultsDashboard.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/ResultsDashboard.jsx) | Workout split viewer. Displays daily exercises in 4-column table (desktop) and stacked cards (mobile). | **Critical** | **Yes** (Workout routine presentation) | Safe to redesign table/card layout; preserve exercise data mapping & modal trigger. |
| [`src/components/infopage.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/infopage.jsx) | Fullscreen Portal modal with movement guide, video/image media, steps, pro tips, and live AI camera. | **Critical** | **Yes** (Exercise guide & AI hub) | Safe to redesign modal layout; preserve `createPortal`, video player, and `PoseDetection`. |
| [`src/components/posedet.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/posedet.jsx) | MediaPipe camera feed, real-time skeleton canvas, HUD (score, reps, warnings, cues), fullscreen mode. | **Critical** | **Yes** (Camera HUD & controls) | Refactor HUD styling only; **DO NOT ALTER** landmark math, canvas loops, or MediaPipe logic. |
| [`src/components/AuthModal.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/AuthModal.jsx) | Unified authentication card (Email + Google GIS + Native). Used on `/login` and as modal dialog. | **Critical** | **Yes** (Authentication UI) | Preserve OAuth hooks (`useGoogleLogin`), email submit handler, and redirect flow. |
| [`src/components/ProtectedRoute.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/ProtectedRoute.jsx) | React Router guard ensuring authentication and completed profile before rendering children. | **Critical** | **No** (Infrastructure) | **Preserve exactly as is.** |
| [`src/components/ToastNotification.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/ToastNotification.jsx) | Global floating toast notification banner. | **Supporting** | **Yes** (Visual alert banner) | Safe to redesign visual styling; preserve `{ message, type }` interface. |
| [`src/components/SkeletonLoader.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/SkeletonLoader.jsx) | Loading pulse skeletons for profile and metrics. | **Supporting** | **Yes** (Loading states) | Safe to redesign to match new component shapes. |
| [`src/components/Spinner.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/Spinner.jsx) | Animated loading spinner for plan generation. | **Supporting** | **Yes** (Loading states) | Safe to redesign with modern spinner/progress bar. |
| [`src/components/cameraupload.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/cameraupload.jsx) | Secondary file/video uploader with client preview. | **Supporting** | **Yes** (Upload widget) | Safe to redesign file picker UI. |
| [`src/components/Template.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/Template.jsx) | Unused development stub. | **Supporting** | **No** | Can be deleted or ignored. |

---

### Profile Sub-Components (`src/components/profile/`)

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/components/profile/ProfileHeader.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/ProfileHeader.jsx) | Top athlete identity card with avatar, verified badge, tier pill, and quick metric pills. | **Important** | **Yes** (Athlete hero section) | Safe to redesign; preserve avatar fallback, user fields, and `onEdit` trigger. |
| [`src/components/profile/WorkoutStats.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/WorkoutStats.jsx) | 4-card statistics grid (Streak, Record, Workouts, Goal). | **Important** | **Yes** (KPI metric cards) | Safe to redesign into modern Bento grid; preserve data bindings. |
| [`src/components/profile/PersonalInformation.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/PersonalInformation.jsx) | Key-value list for physical metrics (Age, Gender, Height, Weight, Bio). | **Important** | **Yes** (Metrics card) | Safe to redesign; preserve `user` props and edit modal trigger. |
| [`src/components/profile/ExercisePreferences.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/ExercisePreferences.jsx) | Key-value list for training goals, level, workout type, and activity level. | **Important** | **Yes** (Preferences card) | Safe to redesign; preserve goal/level label mappings. |
| [`src/components/profile/Achievements.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/Achievements.jsx) | Achievement badges with locked/unlocked visual statuses. | **Important** | **Yes** (Gamification cards) | Safe to redesign badge cards; preserve unlock condition thresholds. |
| [`src/components/profile/EditProfileModal.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/EditProfileModal.jsx) | Full profile edit dialog modal for biometrics and goals. | **Important** | **Yes** (Profile edit form) | Safe to redesign; preserve form state, input validation, and `updateUserProfile` call. |
| [`src/components/profile/SettingsCard.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/components/profile/SettingsCard.jsx) | User preferences toggles (dark mode, notifications) & account deletion dialog. | **Important** | **Yes** (Settings UI) | Safe to redesign; preserve `deleteAccount` modal and navigation. |

---

### Application Context & Configuration

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/context/AuthContext.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/context/AuthContext.jsx) | Global auth state, session fetch, Google/Email login, profile updates, workout logging, logout, toasts. | **Critical** | **Interface Only** (Know what `useAuth()` exports) | **DO NOT MODIFY.** |
| [`src/config/api.js`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/config/api.js) | Resolves backend API URL (`VITE_API_BASE_URL` with cloud fallback). | **Critical** | **No** | **DO NOT MODIFY.** |

---

### Data, AI Rules & Engine Utilities

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/data/exerciseDetails.js`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/data/exerciseDetails.js) | Static fallback database for exercise movement steps, cues, and media. | **Important** | **No** (Data contract only) | **Preserve as is.** |
| [`src/utils/workoutGenerator.js`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/utils/workoutGenerator.js) | Dynamic client-side workout plan generator algorithm. | **Important** | **No** (Data contract only) | **Preserve as is.** |
| `src/exerciseRules/*` (9 files) | Biomechanical mathematical rules for squats, bench, deadlifts, presses, curls, etc. | **Critical** | **No** (Internal logic) | **Preserve as is.** |
| `src/pose/*` (5 files) | MediaPipe landmark math, vector calculations, rep counting state machines. | **Critical** | **No** (Internal logic) | **Preserve as is.** |

---

### Core Layout, Entry & Styles

| File Path | Purpose | Importance | Stitch Needs to Understand? | Preservation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| [`src/App.jsx`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/App.jsx) | Root routing tree, `AppLayout` definition, Google provider wrapper, global modal overlay. | **Critical** | **Yes** (Routing architecture) | Update route JSX to incorporate new layouts; preserve route paths. |
| [`src/index.css`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/src/index.css) | Global stylesheet with Tailwind v4, custom utility classes, and design tokens. | **Critical** | **Yes** (CSS tokens & classes) | Safe to replace/extend with Stitch's generated CSS system. |
| [`index.html`](file:///c:/Users/GOURAV%20GABA/Downloads/the%20gym%20bro/index.html) | HTML entry with Google Fonts (`Inter`, `Outfit`, `Plus Jakarta Sans`) and meta tags. | **Important** | **Yes** (Font & meta tags) | Update font links or meta tags if needed. |

---

## 2. MINIMUM STITCH CONTEXT

When providing context to **Stitch** for the frontend redesign, provide **ONLY** the files listed below to minimize token overhead while maximizing understanding.

### 🔴 MUST PROVIDE (Tier 1 — Core Architecture & Pages)
These files give Stitch the complete picture of routing, page layout, forms, and core components:
1. `FRONTEND_HANDOFF.md` *(The complete architectural handoff)*
2. `src/App.jsx` *(Routing structure, AppLayout, and provider setup)*
3. `src/pages/DashboardPage.jsx` *(Workout generator page flow)*
4. `src/components/WorkoutForm.jsx` *(4-step generator form)*
5. `src/components/LevelController.jsx` *(Conditional beginner/intermediate/advanced form)*
6. `src/components/ResultsDashboard.jsx` *(Workout split results table & cards)*
7. `src/pages/LoginPage.jsx` & `src/components/AuthModal.jsx` *(Standalone login UI & auth card)*
8. `src/components/Navbar.jsx` *(Main application navigation bar & mobile drawer)*

### 🟡 SHOULD PROVIDE (Tier 2 — Profile, Modals & AI HUD)
Provide these files when prompting Stitch to design the Profile, Settings, and Exercise Modal views:
9. `src/pages/ProfilePage.jsx` *(Profile overview)*
10. `src/components/profile/ProfileHeader.jsx` & `src/components/profile/WorkoutStats.jsx` *(Athlete banner & KPI metrics)*
11. `src/components/profile/PersonalInformation.jsx` & `src/components/profile/ExercisePreferences.jsx` *(Biometrics & training cards)*
12. `src/components/profile/Achievements.jsx` *(Badges & milestones)*
13. `src/components/profile/EditProfileModal.jsx` *(Profile editor modal)*
14. `src/components/profile/SettingsCard.jsx` *(Settings & preferences card)*
15. `src/pages/CompleteProfilePage.jsx` *(Onboarding setup card)*
16. `src/components/infopage.jsx` *(Exercise movement guide modal)*
17. `src/components/posedet.jsx` *(Camera video container & HUD overlay elements)*

### 🟢 OPTIONAL / DO NOT PROVIDE TO STITCH
Stitch does **NOT** need these files (they are internal logic, vision vector math, or static databases that Antigravity will re-attach during integration):
- `src/pose/*` (`angleUtils.js`, `feedbackEngine.js`, `landmarkUtils.js`, `postureEvaluator.js`, `repCounter.js`)
- `src/exerciseRules/*` (all 9 exercise rule files)
- `src/data/exerciseDetails.js`
- `src/utils/workoutGenerator.js`
- `src/context/AuthContext.jsx`
- `src/config/api.js`
- `server/*` (Backend models, controllers, and routes)

---

## 3. Frontend / Backend Coupling Notes

Stitch must be aware of these exact field names and payload contracts:

1. **Fitness Goals**: Values must strictly match `'muscle_gain' | 'fat_loss' | 'strength'`.
2. **Experience Levels**: Values must strictly match `'beginner' | 'intermediate' | 'advanced'`.
3. **Split Days**: Intermediate days must be `'3' | '4' | '5' | '6'`.
4. **Target Muscles**: Advanced muscles array must use `['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core']`.
5. **Workout Plan Result Object**:
   - `plan.splitName` (string)
   - `plan.goalLabel` (string)
   - `plan.levelLabel` (string)
   - `plan.days` (array of `{ name, focus, exercises: [{ name, target, setsReps, videoUrl }] }`)
6. **User Object Schema**:
   - `user._id`, `user.name`, `user.email`, `user.profilePhoto`, `user.joinedAt`
   - `user.fitnessGoal`, `user.experienceLevel`, `user.activityLevel`
   - `user.age`, `user.gender`, `user.height`, `user.weight`, `user.targetWeight`, `user.bio`
   - `user.workoutsCompleted`, `user.currentStreak`, `user.longestStreak`, `user.isProfileComplete`

---

## 4. Potential Risks & Antigravity Safeguards

| Risk Area | Potential Failure Mode | Antigravity Safeguard |
| :--- | :--- | :--- |
| **MediaPipe AI Camera Canvas** | If Stitch replaces the `<video>` and `<canvas>` hierarchy with a non-ref layout, pose tracking will fail. | Antigravity will ensure `videoRef`, `canvasRef`, and the `requestAnimationFrame` loop remain connected to the new video wrapper. |
| **Google GIS Authentication** | If the Google button is rendered as a plain button without `useGoogleLogin` or GIS trigger, OAuth popup will not open. | Antigravity will wire Stitch's new button to `triggerWebGoogleLogin()` and native `GoogleAuth.signIn()`. |
| **Responsive Table Overflow** | Desktop workout tables can cause horizontal scrolling on mobile if not transformed. | Antigravity will ensure desktop tables hide on $< 768\text{px}$ and display stacked cards. |
| **Modal Portals & Scrolling** | If modals don't lock `document.body.style.overflow = "hidden"`, double scrolling occurs on iOS. | Antigravity will preserve modal lifecycle hooks and `createPortal` wrappers. |
| **Form Validation Mismatch** | If Stitch alters form input names or resets states on re-render, plan generation will be blocked. | Antigravity will bind existing state handlers (`goal`, `level`, `days`, `selectedMuscles`) directly to Stitch's new UI controls. |

---

## 5. Recommended Order for Stitch Prompts

When redesigning with Stitch, execute in this clean modular sequence:

1. **Step 1 — Design System & Global Layout**:
   - Provide `App.jsx` + `Navbar.jsx` + Toast notification design references.
   - Goal: Establish typography, dark theme tokens, navigation header, and `AppLayout`.
2. **Step 2 — Standalone Login Page (`/login`)**:
   - Provide `LoginPage.jsx` + `AuthModal.jsx`.
   - Goal: Generate the standalone centered login card with Email and Google login.
3. **Step 3 — Generator Dashboard (`/dashboard`)**:
   - Provide `DashboardPage.jsx` + `WorkoutForm.jsx` + `LevelController.jsx` + `ResultsDashboard.jsx`.
   - Goal: Generate the hero header, interactive 4-step generator form, and routine viewer.
4. **Step 4 — Movement Guide & AI Pose HUD Modal**:
   - Provide `infopage.jsx` + `posedet.jsx`.
   - Goal: Generate the exercise tutorial modal with video media and live camera HUD overlay.
5. **Step 5 — Profile & Settings (`/profile`, `/settings`, `/complete-profile`)**:
   - Provide `ProfilePage.jsx` + `ProfileHeader.jsx` + `WorkoutStats.jsx` + `PersonalInformation.jsx` + `ExercisePreferences.jsx` + `Achievements.jsx` + `EditProfileModal.jsx` + `SettingsCard.jsx`.
   - Goal: Generate the athlete dashboard, Bento metric cards, achievements badges, and settings.
