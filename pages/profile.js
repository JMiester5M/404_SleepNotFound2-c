import { useState, useRef, useEffect } from "react";
import CloudDecoration from "../components/CloudDecoration";

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [userName, setUserName] = useState("Study Warrior");
	const [tempName, setTempName] = useState("Study Warrior");
	const [profileImage, setProfileImage] = useState(null);
	const [nameError, setNameError] = useState("");
	const fileInputRef = useRef(null);

	const [isEditingTimer, setIsEditingTimer] = useState(false);
	const [defaultTimer, setDefaultTimer] = useState(25);
	const [tempTimer, setTempTimer] = useState(25);
	const [timerError, setTimerError] = useState("");

	useEffect(() => {
		const storedName = typeof window !== "undefined" ? localStorage.getItem("najahUserName") : null;
		const storedImage = typeof window !== "undefined" ? localStorage.getItem("najahProfileImage") : null;
		const storedTimer = typeof window !== "undefined" ? localStorage.getItem("najahDefaultTimer") : null;

		if (storedName) {
			setUserName(storedName);
			setTempName(storedName);
		}
		if (storedImage) setProfileImage(storedImage);
		if (storedTimer) {
			const parsed = parseInt(storedTimer, 10);
			if (!Number.isNaN(parsed)) {
				setDefaultTimer(parsed);
				setTempTimer(parsed);
			}
		}
	}, []);

	const inappropriateWords = [
		"damn", "hell", "crap", "fuck", "shit", "bitch", "ass", "asshole",
		"bastard", "dick", "pussy", "cock", "slut", "whore", "piss", "bollocks",
		"wanker", "twat", "cunt", "prick", "douche", "jackass", "fck", "sht",
		"btch", "fuk", "fuq", "shyt", "phuck", "fukk", "shite", "arse",
		"fag", "faggot", "nigger", "nigga", "negro", "chink", "spic", "kike",
		"wetback", "beaner", "gook", "jap", "towelhead", "raghead", "cracker",
		"honky", "tranny", "shemale", "dyke", "homo", "queer",
		"porn", "sex", "xxx", "nude", "naked", "boob", "tit", "penis",
		"vagina", "anal", "oral", "rape", "molest", "horny", "orgasm",
		"kill", "murder", "death", "die", "suicide", "kys", "cancer",
		"hitler", "nazi", "terrorist", "bomb", "shoot", "stab", "attack",
		"stupid", "idiot", "moron", "retard", "dumb", "loser", "worthless",
		"ugly", "fat", "trash", "garbage", "scum", "piece of shit", "pos",
		"cocaine", "heroin", "meth", "weed", "marijuana", "drug", "stoned",
		"hate", "suck", "blow", "lick", "stroke", "jerk", "perv", "creep",
	];

	const containsInappropriateContent = (text) => {
		const lowerText = text.toLowerCase();
		return inappropriateWords.some(word => lowerText.includes(word));
	};

	const handleNameChange = (e) => {
		const newName = e.target.value;
		setTempName(newName);

		if (containsInappropriateContent(newName)) {
			setNameError("Please choose an appropriate name");
		} else {
			setNameError("");
		}
	};

	const handleSaveName = () => {
		if (containsInappropriateContent(tempName)) {
			setNameError("Please choose an appropriate name");
			return;
		}
		if (tempName.trim().length === 0) {
			setNameError("Name cannot be empty");
			return;
		}
		setUserName(tempName);
		if (typeof window !== "undefined") {
			localStorage.setItem("najahUserName", tempName);
		}
		setIsEditing(false);
		setNameError("");
	};

	const handleCancelEdit = () => {
		setTempName(userName);
		setIsEditing(false);
		setNameError("");
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileImage(reader.result);
				if (typeof window !== "undefined") {
					localStorage.setItem("najahProfileImage", reader.result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleTimerEdit = () => {
		setIsEditingTimer(true);
		setTempTimer(defaultTimer);
	};

	const handleTimerChange = (e) => {
		const value = e.target.value;
		const numValue = parseInt(value, 10);

		if (value === "" || (numValue >= 1 && numValue <= 120)) {
			setTempTimer(value === "" ? "" : numValue);
			setTimerError("");
		} else {
			setTimerError("Timer must be between 1 and 120 minutes");
		}
	};

	const handleSaveTimer = () => {
		if (tempTimer === "" || tempTimer < 1 || tempTimer > 120) {
			setTimerError("Please enter a valid timer (1-120 minutes)");
			return;
		}
		setDefaultTimer(tempTimer);
		if (typeof window !== "undefined") {
			localStorage.setItem("najahDefaultTimer", tempTimer.toString());
		}
		setIsEditingTimer(false);
		setTimerError("");
	};

	const handleCancelTimerEdit = () => {
		setTempTimer(defaultTimer);
		setIsEditingTimer(false);
		setTimerError("");
	};

	const achievements = [
		{ id: 1, icon: "🏆", title: "First Task", description: "Complete your first task", unlocked: true },
		{ id: 2, icon: "🔥", title: "7-Day Streak", description: "Study for 7 days in a row", unlocked: true },
		{ id: 3, icon: "⭐", title: "Night Owl", description: "Complete 10 late-night tasks", unlocked: true },
		{ id: 4, icon: "📚", title: "Bookworm", description: "Complete 50 tasks", unlocked: false },
		{ id: 5, icon: "⏰", title: "Time Master", description: "Use timer for 100 hours", unlocked: false },
		{ id: 6, icon: "💎", title: "Diamond", description: "Reach 1000 points", unlocked: false },
	];

	const stats = [
		{ label: "Total Points", value: "248", color: "#10B981" },
		{ label: "Tasks Completed", value: "23", color: "#F97316" },
		{ label: "Study Hours", value: "42", color: "#3B82F6" },
		{ label: "Current Streak", value: "7 days", color: "#9333EA" },
	];

	return (
		<>
			<div className="profile-page">
				<CloudDecoration />

				<div className="profile-header">
					<div className="profile-avatar-container">
						<div className="profile-avatar" onClick={triggerFileInput}>
							{profileImage ? (
								<img src={profileImage} alt="Profile" className="profile-image" />
							) : (
								<div className="profile-placeholder">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</div>
							)}
							<div className="profile-upload-overlay">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
									<circle cx="12" cy="13" r="4" />
								</svg>
								<span>Upload Photo</span>
							</div>
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							style={{ display: "none" }}
						/>
					</div>

					{isEditing ? (
						<div className="profile-name-edit">
							<input
								type="text"
								value={tempName}
								onChange={handleNameChange}
								className={`profile-name-input ${nameError ? "error" : ""}`}
								maxLength={20}
							/>
							{nameError && <p className="profile-name-error">{nameError}</p>}
							<div className="profile-edit-buttons">
								<button onClick={handleSaveName} className="profile-save-btn" disabled={nameError !== ""}>Save</button>
								<button onClick={handleCancelEdit} className="profile-cancel-btn">Cancel</button>
							</div>
						</div>
					) : (
						<div className="profile-name-display">
							<h1 className="profile-name">{userName}</h1>
							<button onClick={() => setIsEditing(true)} className="profile-edit-btn">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
								</svg>
							</button>
						</div>
					)}

					<p className="profile-tagline">Studying with Najah since Nov 2025</p>
				</div>

				<div className="profile-stats-grid">
					{stats.map((stat, index) => (
						<div key={index} className="profile-stat-card">
							<div className="profile-stat-value" style={{ color: stat.color }}>
								{stat.value}
							</div>
							<div className="profile-stat-label">{stat.label}</div>
						</div>
					))}
				</div>

				<div className="profile-section">
					<h2 className="profile-section-title">Achievements</h2>
					<div className="achievements-grid">
						{achievements.map((achievement) => (
							<div
								key={achievement.id}
								className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
							>
								<div className="achievement-icon">{achievement.icon}</div>
								<div className="achievement-title">{achievement.title}</div>
								<div className="achievement-description">{achievement.description}</div>
								{achievement.unlocked && (
									<div className="achievement-badge">✓</div>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="profile-section">
					<h2 className="profile-section-title">Study Preferences</h2>
					<div className="preferences-list">
						<div className="preference-item">
							<span className="preference-label">Default Timer</span>
							{isEditingTimer ? (
								<div className="timer-edit-container">
									<input
										type="number"
										value={tempTimer}
										onChange={handleTimerChange}
										className={`timer-input-field ${timerError ? "error" : ""}`}
										min="1"
										max="120"
										placeholder="Minutes"
									/>
									<div className="timer-edit-buttons">
										<button onClick={handleSaveTimer} className="timer-save-btn" disabled={timerError !== ""}>✓</button>
										<button onClick={handleCancelTimerEdit} className="timer-cancel-btn">✕</button>
									</div>
									{timerError && <p className="timer-error">{timerError}</p>}
								</div>
							) : (
								<div className="preference-value-container">
									<span className="preference-value">{defaultTimer} minutes</span>
									<button onClick={handleTimerEdit} className="preference-edit-btn">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
									</button>
								</div>
							)}
						</div>
						<div className="preference-item">
							<span className="preference-label">Notifications</span>
							<span className="preference-value">Enabled</span>
						</div>
					</div>
				</div>

				<div className="profile-actions">
					<button className="profile-action-btn secondary">Export Study Data</button>
					<button className="profile-action-btn secondary">Reset Statistics</button>
					<button className="profile-action-btn danger">Sign Out</button>
				</div>
			</div>

			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
			<div className="bubble"></div>
		</>
	);
}
