using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using BookLibrary.Models;
namespace BookLibrary.Authorization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute: Attribute, IAuthorizationFilter
    {
        private readonly IList<Role> _roles;

        public AuthorizeAttribute(params Role[] roles)
        {
            _roles = roles ?? new Role[] { };
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // skip authorization if action is decorated with [AllowAnonymous] attribute
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            // authorization
            var user = (User)context.HttpContext.Items["User"];
            var reqUserId = context.HttpContext.Items["reqID"]?.ToString();
            

            if (user == null || (_roles.Any() && !_roles.Contains(user.Role)))
            {
                context.Result = new JsonResult(new { message = "Unauthorized" }) { 
                    StatusCode = StatusCodes.Status401Unauthorized 
                };
            }
            if (reqUserId != null)
            {

                if (user.Role == Role.User && reqUserId != user.Id)
                {

                    context.Result = new JsonResult(new { message = "Unauthorized" }) { 
                        StatusCode = StatusCodes.Status401Unauthorized 
                    };
                }

            }
        }

    }
}



