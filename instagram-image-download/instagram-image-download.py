import sys
import instaloader

def download_instagram_photos(profile_url):
    # Create Instaloader instance
    L = instaloader.Instaloader()

    try:
        # Extract username from URL
        username = profile_url.split('/')[-2] if profile_url.endswith('/') else profile_url.split('/')[-1]

        # Download all posts of the profile
        profile = instaloader.Profile.from_username(L.context, username)
        print(f"Downloading photos of {username}...")

        for post in profile.get_posts():
            L.download_post(post, target=username)

        print(f"Finished downloading photos of {username}.")

    except instaloader.exceptions.ProfileNotExistsException:
        print(f"Error: Profile with username {username} not found.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python download_instagram_photos.py <Instagram_profile_URL>")
        sys.exit(1)

    profile_url = sys.argv[1]
    download_instagram_photos(profile_url)