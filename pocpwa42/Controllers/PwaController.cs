using Microsoft.AspNetCore.Mvc;

namespace pocpwa42.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PwaController : ControllerBase
    {
        // Хранилище в памяти: Корпоративный ID (или сессия) -> Токен Firebase
        private static readonly Dictionary<string, string> _userRegistry = new();

        // 1. Регистрация устройства после входа
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegistrationRequest request)
        {
            // Имитируем привязку токена к пользователю (например, из сертификата)
            _userRegistry[request.UserId] = request.FcmToken;
            return Ok(new { message = $"Токен для {request.UserId} обновлен" });
        }

        // 2. Отправка ПЕРСОНАЛЬНОГО пуша (через Swagger для теста)
        [HttpPost("send-private")]
        public async Task<IActionResult> SendPrivate(string userId, string text)
        {
            if (_userRegistry.TryGetValue(userId, out var token))
            {
                var message = new FirebaseAdmin.Messaging.Message()
                {
                    Token = token,
                    Data = new Dictionary<string, string> { { "visitorName", text } },
                    Notification = new FirebaseAdmin.Messaging.Notification { Title = "Лично вам", Body = text }
                };
                await FirebaseAdmin.Messaging.FirebaseMessaging.DefaultInstance.SendAsync(message);
                return Ok("Пуш отправлен на личное устройство");
            }
            return NotFound("Пользователь не найден или не зарегистрировал устройство");
        }
    }

    public record RegistrationRequest(string UserId, string FcmToken);

}
