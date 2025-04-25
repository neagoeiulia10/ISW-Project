using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TravelApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace TravelApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TravelappContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(TravelappContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            try
            {
                _logger.LogInformation($"Login attempt for user: {loginModel.Username}");

                if (string.IsNullOrEmpty(loginModel.Username) || string.IsNullOrEmpty(loginModel.Password))
                {
                    _logger.LogWarning("Login failed: Empty username or password");
                    return BadRequest(new { success = false, message = "Username and password are required" });
                }

                // Check if user exists in database
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginModel.Username);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User not found - {loginModel.Username}");
                    return Unauthorized(new { success = false, message = "Username or password incorrect" });
                }

                // Verify password
                if (user.Password != loginModel.Password)
                {
                    _logger.LogWarning($"Login failed: Invalid password for user - {loginModel.Username}");
                    return Unauthorized(new { success = false, message = "Username or password incorrect" });
                }

                _logger.LogInformation($"Login successful for user: {loginModel.Username}");
                return Ok(new { success = true, message = "Login successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel registerModel)
        {
            try
            {
                _logger.LogInformation($"Registration attempt for user: {registerModel.Username}");

                if (string.IsNullOrEmpty(registerModel.Username) || string.IsNullOrEmpty(registerModel.Password))
                {
                    _logger.LogWarning("Registration failed: Empty username or password");
                    return BadRequest(new { success = false, message = "Username and password are required" });
                }

                // Check if username already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == registerModel.Username);

                if (existingUser != null)
                {
                    _logger.LogWarning($"Registration failed: Username already exists - {registerModel.Username}");
                    return BadRequest(new { success = false, message = "Username already exists" });
                }

                // Create new user
                var newUser = new User
                {
                    Username = registerModel.Username,
                    Password = registerModel.Password
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Registration successful for user: {registerModel.Username}");
                return Ok(new { success = true, message = "Registration successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred during registration" });
            }
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
} 