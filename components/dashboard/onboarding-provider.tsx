"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Store, 
  Scissors, 
  Clock, 
  Link2, 
  X, 
  ChevronRight,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"

interface OnboardingContextType {
  startWalkthrough: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboardingTrigger() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboardingTrigger must be used within OnboardingProvider")
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
  hasShop: boolean
}

const steps = [
  {
    icon: Store,
    titleKey: "onboarding.step1Title",
    descriptionKey: "onboarding.step1Description",
    route: "/dashboard/settings",
    matchPath: "/dashboard/settings",
    actionKey: "onboarding.goToShopSettings"
  },
  {
    icon: Scissors,
    titleKey: "onboarding.step2Title",
    descriptionKey: "onboarding.step2Description",
    route: "/dashboard/services",
    matchPath: "/dashboard/services",
    actionKey: "onboarding.goToServices"
  },
  {
    icon: Clock,
    titleKey: "onboarding.step3Title",
    descriptionKey: "onboarding.step3Description",
    route: "/dashboard/settings?tab=booking",
    matchPath: "/dashboard/settings",
    actionKey: "onboarding.goToBookingSettings"
  },
  {
    icon: Link2,
    titleKey: "onboarding.step4Title",
    descriptionKey: "onboarding.step4Description",
    route: "/dashboard/settings?tab=booking",
    matchPath: "/dashboard/settings",
    actionKey: "onboarding.goToBookingLink"
  }
]

export function OnboardingProvider({ children, hasShop }: OnboardingProviderProps) {
  const [showGuide, setShowGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const wasDismissed = localStorage.getItem("tresser-onboarding-dismissed")
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])

  const startWalkthrough = useCallback(() => {
    setDismissed(false)
    localStorage.removeItem("tresser-onboarding-dismissed")
    setShowGuide(true)
  }, [])

  const dismissGuide = useCallback(() => {
    setDismissed(true)
    localStorage.setItem("tresser-onboarding-dismissed", "true")
    setShowGuide(false)
  }, [])

  return (
    <OnboardingContext.Provider value={{ startWalkthrough }}>
      {children}
      {!dismissed && !hasShop && (
        <OnboardingFloatingGuide 
          onDismiss={dismissGuide}
          hasShop={hasShop}
        />
      )}
      {showGuide && hasShop && (
        <OnboardingFloatingGuide 
          onDismiss={dismissGuide}
          hasShop={hasShop}
        />
      )}
    </OnboardingContext.Provider>
  )
}

function OnboardingFloatingGuide({ onDismiss, hasShop }: { onDismiss: () => void; hasShop: boolean }) {
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  
  // Determine current step based on path and shop status
  const getCurrentStep = () => {
    if (!hasShop) return 0 // Must create shop first
    
    // Check if user is on a step's page
    for (let i = 0; i < steps.length; i++) {
      if (pathname.startsWith(steps[i].matchPath)) {
        return i
      }
    }
    return hasShop ? 1 : 0 // Default to services if has shop
  }
  
  const currentStepIndex = getCurrentStep()
  const step = steps[currentStepIndex]
  const StepIcon = step.icon
  
  // Check if user is on the current step's page
  const isOnCurrentPage = pathname.startsWith(step.matchPath)
  
  // Calculate completed steps
  const completedSteps = hasShop ? 1 : 0

  return (
    <div 
      className={`fixed bottom-6 z-40 transition-all duration-300 ${
        isRTL ? 'left-6' : 'right-6'
      }`}
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isOnCurrentPage ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
            }`}>
              {isOnCurrentPage && hasShop ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <StepIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("onboarding.stepOf")
                  .replace("{current}", String(currentStepIndex + 1))
                  .replace("{total}", String(steps.length))}
              </p>
              <h4 className="font-semibold text-sm">{t(step.titleKey)}</h4>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={onDismiss}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-3">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index < completedSteps 
                  ? "bg-green-500" 
                  : index === currentStepIndex 
                    ? "bg-primary" 
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3">
          {t(step.descriptionKey)}
        </p>
        
        {/* Action */}
        {!isOnCurrentPage ? (
          <Link href={step.route}>
            <Button size="sm" className="w-full bg-primary text-primary-foreground">
              {t(step.actionKey)}
              <ArrowRight className={`w-3 h-3 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 rounded-lg p-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t("onboarding.youAreHere")}</span>
          </div>
        )}
        
        {/* Next step hint */}
        {isOnCurrentPage && currentStepIndex < steps.length - 1 && hasShop && (
          <Link href={steps[currentStepIndex + 1].route}>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
              {t("onboarding.nextStep")}: {t(steps[currentStepIndex + 1].titleKey)}
              <ChevronRight className={`w-3 h-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
