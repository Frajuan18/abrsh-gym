import React, { useState, useEffect } from "react";
import {
  Heart,
  Dumbbell,
  Target,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Apple,
  Coffee,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Award,
  TrendingUp,
  Clock,
  User,
  Zap,
  Shield,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assessmentsService } from "../services/databaseService";

const FitnessAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",

    // Step 2: Physical Metrics
    height: "",
    weight: "",
    waistCircumference: "",

    // Step 3: Lifestyle & Habits
    activityLevel: "",
    exerciseFrequency: "",
    exerciseDuration: "",
    dietType: "",
    waterIntake: "",
    sleepHours: "",

    // Step 4: Goals & Preferences
    primaryGoal: "",
    secondaryGoal: "",
    preferredWorkoutTime: "",
    workoutLocation: "",
    equipmentAccess: "",
    healthConditions: [],

    // Step 5: Health History
    injuries: "",
    medicalConditions: "",
    medications: "",
    allergies: "",

    // Step 6: Motivation & Commitment
    motivationLevel: "",
    weeklyAvailability: "",
    budget: "",
    experienceLevel: "",
  });

  const totalSteps = 6;

  // Update progress whenever currentStep changes
  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value],
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitAssessment = async () => {
    try {
      console.log("Submitting assessment...");

      // Store user email for later notifications
      if (formData.email) {
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("last_assessment_email", formData.email);
        sessionStorage.setItem("assessmentEmail", formData.email);
      }

      // Submit to database
      const result = await assessmentsService.submitAssessment(formData);

      // Store assessment ID
      if (result?.assessment_id) {
        localStorage.setItem("last_assessment_id", result.assessment_id);

        // Also store in recent assessments list
        const recentAssessments = JSON.parse(
          localStorage.getItem("recent_assessments") || "[]"
        );
        recentAssessments.unshift({
          id: result.assessment_id,
          email: formData.email,
          timestamp: new Date().toISOString(),
          status: "pending",
        });

        // Keep only last 5 assessments
        if (recentAssessments.length > 5) {
          recentAssessments.pop();
        }

        localStorage.setItem(
          "recent_assessments",
          JSON.stringify(recentAssessments)
        );
      }

      alert(
        "Assessment submitted successfully! You will be notified when results are ready."
      );
      navigate(`/assessment/status/${result.assessment_id}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit: " + error.message);
    }
  };

  // Activity Level Options
  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentary",
      description: "Little to no exercise",
    },
    {
      value: "light",
      label: "Lightly Active",
      description: "Light exercise 1-3 days/week",
    },
    {
      value: "moderate",
      label: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
    },
    {
      value: "active",
      label: "Very Active",
      description: "Hard exercise 6-7 days/week",
    },
    {
      value: "athlete",
      label: "Extra Active",
      description: "Very hard exercise & physical job",
    },
  ];

  // Goal Options
  const goalOptions = [
    {
      value: "weight-loss",
      label: "Weight Loss",
      icon: <Scale size={20} />,
      color: "from-red-500 to-orange-500",
    },
    {
      value: "muscle-gain",
      label: "Muscle Gain",
      icon: <Dumbbell size={20} />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      value: "endurance",
      label: "Improve Endurance",
      icon: <Activity size={20} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "strength",
      label: "Increase Strength",
      icon: <Zap size={20} />,
      color: "from-yellow-500 to-amber-500",
    },
    {
      value: "flexibility",
      label: "Better Flexibility",
      icon: <TrendingUp size={20} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "health",
      label: "Overall Health",
      icon: <Heart size={20} />,
      color: "from-teal-500 to-cyan-500",
    },
    {
      value: "sport",
      label: "Sport Performance",
      icon: <Trophy size={20} />,
      color: "from-rose-500 to-red-500",
    },
    {
      value: "recovery",
      label: "Injury Recovery",
      icon: <Shield size={20} />,
      color: "from-gray-500 to-blue-500",
    },
  ];

  // Health Conditions
  const healthConditionOptions = [
    "Heart Condition",
    "High Blood Pressure",
    "Diabetes",
    "Asthma",
    "Arthritis",
    "Back Pain",
    "Joint Issues",
    "Other Chronic Condition",
    "None",
  ];

  // Step 1: Personal Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">Let's start with the basics about you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="28"
            min="16"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
        <div className="flex items-start space-x-3">
          <Shield className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-blue-800 text-sm">
              Your Privacy is Protected
            </h4>
            <p className="text-blue-700 text-sm mt-1">
              Your information is encrypted and stored securely. We'll never
              share your personal details without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Physical Metrics
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ruler size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Physical Metrics
        </h2>
        <p className="text-gray-600">
          Help us understand your current physical state
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-4">
            <Ruler size={24} className="text-orange-600" />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-lg font-bold"
            placeholder="175"
            min="100"
            max="250"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Scale size={24} className="text-blue-600" />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-lg font-bold"
            placeholder="70"
            min="30"
            max="300"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mb-4">
            <Activity size={24} className="text-green-600" />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waist Circumference (cm)
          </label>
          <input
            type="number"
            value={formData.waistCircumference}
            onChange={(e) =>
              handleInputChange("waistCircumference", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-lg font-bold"
            placeholder="85"
            min="50"
            max="200"
          />
        </div>
      </div>

      {/* BMI Calculator Preview */}
      {formData.height && formData.weight && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mt-8">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-indigo-600" />
            Estimated BMI: {calculateBMI()}
          </h4>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(calculateBMIPercentage(), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>
        </div>
      )}
    </div>
  );

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return "N/A";
    const heightInMeters = formData.height / 100;
    const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(
      1
    );
    return bmi;
  };

  const calculateBMIPercentage = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return 25;
    if (bmi < 25) return 50;
    if (bmi < 30) return 75;
    return 100;
  };

  // Step 3: Lifestyle & Habits
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lifestyle & Habits
        </h2>
        <p className="text-gray-600">
          Tell us about your daily routine and habits
        </p>
      </div>

      {/* Activity Level */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Daily Activity Level
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {activityLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleInputChange("activityLevel", level.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.activityLevel === level.value
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">
                {level.label}
              </div>
              <div className="text-xs text-gray-600">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Frequency
          </label>
          <select
            value={formData.exerciseFrequency}
            onChange={(e) =>
              handleInputChange("exerciseFrequency", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="never">Never</option>
            <option value="1-2">1-2 times/week</option>
            <option value="3-4">3-4 times/week</option>
            <option value="5-6">5-6 times/week</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Workout Duration
          </label>
          <select
            value={formData.exerciseDuration}
            onChange={(e) =>
              handleInputChange("exerciseDuration", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="30">30 minutes or less</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">2 hours or more</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Water Intake
          </label>
          <select
            value={formData.waterIntake}
            onChange={(e) => handleInputChange("waterIntake", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="low">Less than 1L</option>
            <option value="moderate">1-2L</option>
            <option value="good">2-3L</option>
            <option value="excellent">More than 3L</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Sleep Hours
          </label>
          <select
            value={formData.sleepHours}
            onChange={(e) => handleInputChange("sleepHours", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="less6">Less than 6 hours</option>
            <option value="6-7">6-7 hours</option>
            <option value="7-8">7-8 hours</option>
            <option value="more8">More than 8 hours</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 4: Goals & Preferences
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Goals & Preferences
        </h2>
        <p className="text-gray-600">What do you want to achieve?</p>
      </div>

      {/* Primary Goal */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Primary Goal</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goalOptions.map((goal) => (
            <button
              key={goal.value}
              onClick={() => handleInputChange("primaryGoal", goal.value)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                formData.primaryGoal === goal.value
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center mb-3`}
              >
                {goal.icon}
              </div>
              <span className="font-medium text-gray-900">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Health Conditions (Select all that apply)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {healthConditionOptions.map((condition) => (
            <button
              key={condition}
              onClick={() => handleArrayToggle("healthConditions", condition)}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.healthConditions?.includes(condition)
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">
                  {condition}
                </span>
                {formData.healthConditions?.includes(condition) && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 5: Health History
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Health History
        </h2>
        <p className="text-gray-600">
          Important health information for safe training
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Injuries
          </label>
          <textarea
            value={formData.injuries}
            onChange={(e) => handleInputChange("injuries", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            rows="3"
            placeholder="Describe any previous injuries (knee, back, shoulder, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions
          </label>
          <textarea
            value={formData.medicalConditions}
            onChange={(e) =>
              handleInputChange("medicalConditions", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            rows="3"
            placeholder="Any diagnosed medical conditions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </label>
          <textarea
            value={formData.medications}
            onChange={(e) => handleInputChange("medications", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            rows="2"
            placeholder="List any medications you're currently taking"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <textarea
            value={formData.allergies}
            onChange={(e) => handleInputChange("allergies", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            rows="2"
            placeholder="Any allergies (food, medication, environmental)"
          />
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-8">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-red-800 text-sm">
              Important Medical Disclaimer
            </h4>
            <p className="text-red-700 text-sm mt-1">
              This information helps us create a safe training plan. Please
              consult with your healthcare provider before starting any new
              fitness program, especially if you have existing health
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 6: Motivation & Commitment
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Motivation & Commitment
        </h2>
        <p className="text-gray-600">
          Help us understand your commitment level
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivation Level (1-10)
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Low</span>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.motivationLevel || 5}
              onChange={(e) =>
                handleInputChange("motivationLevel", e.target.value)
              }
              className="flex-1 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg"
            />
            <span className="text-sm text-gray-600">High</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-orange-600">
              {formData.motivationLevel || 5}/10
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Availability (hours)
          </label>
          <input
            type="number"
            value={formData.weeklyAvailability}
            onChange={(e) =>
              handleInputChange("weeklyAvailability", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-lg font-bold"
            placeholder="5"
            min="1"
            max="20"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            How many hours per week can you dedicate to fitness?
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={formData.experienceLevel}
            onChange={(e) =>
              handleInputChange("experienceLevel", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Select</option>
            <option value="beginner">Beginner (0-6 months)</option>
            <option value="intermediate">
              Intermediate (6 months - 2 years)
            </option>
            <option value="advanced">Advanced (2+ years)</option>
            <option value="athlete">Athlete/Competitive</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mt-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">🎉 You're Almost Done!</h4>
            <p className="text-gray-700 text-sm mt-1">
              Submit your assessment to receive a personalized fitness plan
              with: Custom workout routine, Nutrition guide, Progress tracking,
              and Trainer recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  const stepTitles = [
    "Personal Information",
    "Physical Metrics",
    "Lifestyle & Habits",
    "Goals & Preferences",
    "Health History",
    "Motivation & Commitment",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Fitness
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Assessment
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this 6-step assessment to receive your personalized fitness
            plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </div>
            <div className="text-sm font-bold text-orange-600">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-10 relative">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${
                  currentStep > index + 1
                    ? "bg-green-500 border-green-500"
                    : currentStep === index + 1
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle size={20} className="text-white" />
                ) : (
                  <span
                    className={`font-bold ${
                      currentStep === index + 1 ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium text-center max-w-16 ${
                  currentStep === index + 1 ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {title.split(" ")[0]}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 -z-10"></div>
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 -z-10 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          ></div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Save & Exit
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
              >
                <span>Next Step</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={submitAssessment}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all"
              >
                <CheckCircle size={20} />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center text-gray-500 text-sm">
            <HelpCircle size={16} className="mr-2" />
            Need help? Contact our fitness advisors at support@fitnesspro.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessAssessment;
