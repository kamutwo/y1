const { Base, Message, PermissionsBitField, User, Guild, Locale, GuildMember, InteractionType, MessageType, DiscordjsError, DiscordjsErrorCodes, MessagePayload, MessageFlags, Routes, InteractionResponseType, InteractionResponse } = require('discord.js');

class CommandContext extends Base {
	/**
	 * @param {Message | import('discord.js').Interaction} context
	 * @param {string[]} args
	 */
	constructor(context, args) {
		super(context.client);

		this.args = args;

		this.ctx = context;

		/**
		 * Group activity.
		 * @type {?import('discord.js').MessageActivity}
		 */
		this.activity = context.activity;

		/**
		 * The application's id that sent this interaction.
		 * @type {import('discord.js').Snowflake}
		 */
		this.applicationId = context.applicationId;

		/**
		 * Set of permissions the application or bot has within the channel the message / interaction was sent from.
		 * @type {?Readonly<PermissionsBitField>}
		 */
		this.appPermissions = context.appPermissions ?? this.channel?.permissionsFor(this.guild?.members.me);

		/**
		 * The author / user of the message / interaction.
		 * @type {User}
		 */
		this.author = context.author ?? context.user;

		/**
		 * The user / author who created this interaction / message.
		 * @type {User}
		 */
		this.user = context.user ?? context.author;

		/**
		 * The channel this message / interaction was sent in.
		 * @type {?Readonly<import('discord.js').TextBasedChannel>}
		 */
		this.channel = context.channel;

		/**
		 * The id of the channel this message / interaction was sent in.
		 * @type {?import('discord.js').Snowflake}
		 */
		this.channelId = context.channelId;

		/**
		 * The content of the message / interaction.
		 * @type {?string}
		 */
		this.content = context.content ?? process.env.PREFIX + args.join(' ');

		/**
		 * The time the message / interaction was created at.
		 * @type {Readonly<Date>}
		 */
		this.createdAt = context.createdAt;

		/**
		 * The timestamp the message / interaction was created at.
		 * @type {Readonly<number>}
		 */
		this.createdTimestamp = context.createdTimestamp;

		/**
		 * The guild this message / interaction was sent in.
		 * @type {?Readonly<Guild>}
		 */
		this.guild = context.guild;

		/**
		 * The id of the guild this message / interaction was sent in.
		 * @type {?import('discord.js').Snowflake}
		 */
		this.guildId = context.guildId;

		/**
		 * The preferred locale from the guild this message / interaction was sent in.
		 * @type {?Locale}
		 */
		this.guildLocale = context.guildLocale ?? this.guild?.preferredLocale;

		/**
		 * The message's / interaction's id.
		 * @type {import('discord.js').Snowflake}
		 */
		this.id = context.id;

		/**
		 * The GuildMember who sent this message / interaction.
		 * @type {?Readonly<GuildMember | ?import('discord.js').APIGuildMember>}
		 */
		this.member = context.member;

		/**
		 * The permissions of the member, if one exists, in the channel this interaction was executed in.
		 * @type {?Readonly<PermissionsBitField>}
		 */
		this.memberPermissions = context.memberPermissions ?? this.channel?.permissionsFor(this.member);

		/**
		 * The message's / interaction's type.
		 * @type {?MessageType | InteractionType}
		 */
		this.type = context.type;
	}

	/**
	 * Sends / Creates a reply to this message / interaction.
	 * @param {string | MessagePayload | MessageReplyOptions | import('discord.js').InteractionReplyOptions} options
	 * @returns {Promise<(Message<boolean> | InteractionResponse<boolean>)>}
	 */
	async reply(options) {
		if (this.isMessage) {
			if (!this.channel) {
				return Promise.reject(new DiscordjsError(DiscordjsErrorCodes.ChannelNotCached));
			}

			const messagePayload = options instanceof MessagePayload ? options : MessagePayload.create(this.ctx, options, { allowedMentions: { repliedUser: false }, reply: { messageReference: this.ctx, failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists } });
			const message = await this.channel.send(messagePayload);
			if (options.ephemeral) {
				setTimeout(() => {
					this.channel.messages.resolve(this.id)?.delete();
					this.channel.messages.resolve(message.id)?.delete();
				}, 30000);
			}

			return message;
		}
		else {
			if (this.ctx.deferred || this.ctx.replied) {
				throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);
			}
			this.ctx.ephemeral = options.ephemeral ?? false;

			await this.client.rest.post(Routes.interactionCallback(this.id, this.ctx.token), {
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					data: {
						flags: options.ephemeral ? MessageFlags.Ephemeral : undefined,
					},
				},
				auth: false,
			});
			this.deferred = true;

			const message = await this.ctx.webhook.editMessage('@original', options);
			this.replied = true;

			return message;

			// const messagePayload = options instanceof discord.MessagePayload ? options : discord.MessagePayload.create(this.ctx, options);
			// const { body: data, files } = await messagePayload.resolveBody().resolveFiles();

			// await this.client.rest.post(discord.Routes.interactionCallback(this.id, this.ctx.token), {
			// 	body: {
			// 		type: discord.InteractionResponseType.ChannelMessageWithSource,
			// 		data,
			// 	},
			// 	files,
			// 	auth: false,
			// });
			// this.ctx.replied = true;

			// return options.fetchReply ? this.ctx.fetchReply() : new discord.InteractionResponse(this.ctx);
		}
	}

	/**
	 * Sends a message to this message's / interaction's channel.
	 * @param {string |  MessagePayload | import('discord.js').MessageCreateOptions} options
	 * @returns {Promise<(Message<false> | Message<true>)>}
	 */
	async send(options) {
		if (this.isMessage) {
			if (!this.channel) {
				return Promise.reject(new DiscordjsError(DiscordjsErrorCodes.ChannelNotCached));
			}

			const messagePayload = options instanceof MessagePayload ? options : MessagePayload.create(this.ctx, options);
			const message = await this.channel.send(messagePayload);

			return message;
		}
		else {
			if (this.ctx.deferred || this.ctx.replied) {
				throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);
			}

			console.log(1);
			await this.client.rest.post(Routes.interactionCallback(this.id, this.ctx.token), {
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					data: {
						flags: MessageFlags.Ephemeral,
					},
				},
				auth: false,
			});
			this.deferred = true;

			const messagePayload = options instanceof MessagePayload ? options : MessagePayload.create(this.ctx, options);
			const message = await this.channel.send(messagePayload);
			this.ctx.webhook.deleteMessage('@original');

			return message;
		}
	}

	get isMessage() {
		return this.ctx instanceof Message;
	}
}

module.exports = CommandContext;