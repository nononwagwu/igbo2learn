document.addEventListener('DOMContentLoaded', () => {
    const profile = getUserProfile();

    const welcome = document.getElementById('welcome-message');
    const onboarding = document.getElementById('onboarding');
    const form = document.getElementById('profile-form');

    function showWelcome(user) {
        onboarding.hidden = true;
        welcome.hidden = false;

        document.getElementById('welcome-name').textContent =
            `Ndewo, ${user.name}!`;

        document.getElementById('welcome-level').textContent =
            `Your learning level: ${user.level}`;
    }

    if (profile) {
        showWelcome(profile);
    } else {
        onboarding.hidden = false;
        welcome.hidden = true;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('user-name').value;
        const level = document.getElementById('user-level').value;

        if (!name.trim() || !level) return;

        saveUserProfile(name, level);

        showWelcome({
            name: name.trim(),
            level: level
        });
    });

    document.getElementById('edit-profile').addEventListener('click', () => {
        const currentProfile = getUserProfile();

        document.getElementById('user-name').value = currentProfile.name;
        document.getElementById('user-level').value = currentProfile.level;

        welcome.hidden = true;
        onboarding.hidden = false;
    });
});