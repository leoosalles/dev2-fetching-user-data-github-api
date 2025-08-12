function formatHttpError(response, context = 'Request') {
    const { status, url } = response;

    let message;

    switch (status) {
        case 404:
            message = getNotFoundMessage(context);
            break;
        case 403:
            message = "🚫 Access denied. You may have exceeded GitHub's request limit.";
            break;
        case 500:
            message = "💥 Internal server error. Please try again later.";
            break;
        default:
            message = "⚠️ An unexpected error occurred. Please check your connection or try again.";
    }

    return {
        code: status,
        message,
        url,
        context,
        fullMessage: `${context} failed with status ${status}: ${message} [URL: ${url}]`
    };
};

function getNotFoundMessage(context) {
    switch (context) {
        case 'User':
            return "😢 User not found. Please check the user name and try again.";
        case 'Repositories':
            return "📭 No repositories found for this user.";
        case 'Image':
            return "🖼️ Unable to display repository image.";
        default:
            return "🔍 Resource not found.";
    };
};

export { formatHttpError };