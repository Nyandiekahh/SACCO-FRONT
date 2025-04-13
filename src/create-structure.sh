#!/bin/bash

# Create directories
mkdir -p assets
mkdir -p components/common
mkdir -p components/admin
mkdir -p components/member
mkdir -p components/auth
mkdir -p layouts
mkdir -p pages/auth
mkdir -p pages/admin
mkdir -p pages/member
mkdir -p services
mkdir -p store/auth
mkdir -p store/members
mkdir -p store/contributions
mkdir -p store/loans
mkdir -p utils
mkdir -p hooks
mkdir -p context

# Create files for common components
touch components/common/{Button.jsx,Card.jsx,Input.jsx,Modal.jsx,Navbar.jsx,Sidebar.jsx,Table.jsx}

# Create files for admin components
touch components/admin/{MemberList.jsx,ContributionForm.jsx,LoanApproval.jsx}

# Create files for member components
touch components/member/{ProfileCard.jsx,LoanApplication.jsx,ContributionHistory.jsx}

# Create files for auth components
touch components/auth/{OTPForm.jsx,RegistrationForm.jsx,PasswordResetForm.jsx}

# Layouts
touch layouts/{AdminLayout.jsx,MemberLayout.jsx,AuthLayout.jsx}

# Auth pages
touch pages/auth/{Login.jsx,OTPLogin.jsx,CompleteRegistration.jsx,PasswordReset.jsx}

# Admin pages
touch pages/admin/{Dashboard.jsx,Members.jsx,Contributions.jsx,Loans.jsx,Reports.jsx,Settings.jsx}

# Member pages
touch pages/member/{Dashboard.jsx,Profile.jsx,Contributions.jsx,ShareCapital.jsx,LoanApplication.jsx,Documents.jsx}

# Services
touch services/{api.js,authService.js,memberService.js,contributionService.js,loanService.js}

# Utils
touch utils/{formatters.js,validators.js,constants.js}

# Hooks
touch hooks/{useAuth.js,useForm.js,useModal.js}

# Context
touch context/AuthContext.jsx

# Root files
touch App.jsx index.jsx
